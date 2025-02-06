import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('vulnerability-scanner');

    // Analyze on save or change
    vscode.workspace.onDidSaveTextDocument(analyzeDocument);
    vscode.workspace.onDidChangeTextDocument((event) => analyzeDocument(event.document));

    // Register code action provider
    const fixProvider = new VulnerabilityFixProvider();
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('*', fixProvider, {
            providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
        })
    );
}

async function analyzeDocument(document: vscode.TextDocument) {
    const filePath = document.uri.fsPath;
    const languageId = document.languageId;
    let diagnostics: vscode.Diagnostic[] = [];

    try {
        switch (languageId) {
            case 'python':
                diagnostics = await analyzePython(filePath);
                break;
            case 'c':
            case 'cpp':
                diagnostics = await analyzeCpp(filePath);
                break;
            default:
                vscode.window.showWarningMessage(`Unsupported language: ${languageId}`);
                break;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Analysis failed: ${error}`);
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

// C/C++ analysis with cppcheck
async function analyzeCpp(filePath: string): Promise<vscode.Diagnostic[]> {
    const diagnostics: vscode.Diagnostic[] = [];
    try {
        const { stdout } = await execAsync(`cppcheck --enable=all ${filePath}`);
        const regex = /\[([^:]+):(\d+)\]: (.*)/g;
        let match;
        while ((match = regex.exec(stdout)) !== null) {
            const line = parseInt(match[2]) - 1;
            const message = match[3];
            const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);
            const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
            diagnostic.source = 'vulnerability-scanner';
            diagnostics.push(diagnostic);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Cppcheck failed: ${error}`);
    }
    return diagnostics;
}

// Python analysis with Bandit
async function analyzePython(filePath: string): Promise<vscode.Diagnostic[]> {
    const diagnostics: vscode.Diagnostic[] = [];
    try {
        await execAsync('bandit --version');
    } catch (error) {
        vscode.window.showErrorMessage('Bandit not installed. Run: pip install bandit');
        return diagnostics;
    }

    try {
        const { stdout } = await execAsync(`bandit -f json -q ${filePath}`);
        const report = JSON.parse(stdout);
        for (const result of report.results) {
            const line = result.line_number - 1;
            const message = `${result.test_id}: ${result.issue_text} (Severity: ${result.issue_severity})`;
            const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);
            const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
            diagnostic.source = 'vulnerability-scanner';
            diagnostics.push(diagnostic);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Bandit failed: ${error}`);
    }
    return diagnostics;
}

class VulnerabilityFixProvider implements vscode.CodeActionProvider {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext
    ): vscode.CodeAction[] {
        return context.diagnostics.map(diagnostic => {
            const action = new vscode.CodeAction(
                `Fix: ${diagnostic.message}`,
                vscode.CodeActionKind.QuickFix
            );
            action.command = {
                command: 'extension.fixVulnerability',
                title: 'Fix Vulnerability',
                arguments: [document, diagnostic]
            };
            return action;
        });
    }
}

vscode.commands.registerCommand('extension.fixVulnerability', async (document: vscode.TextDocument, diagnostic: vscode.Diagnostic) => {
    if (!document || !diagnostic) {
        vscode.window.showErrorMessage('Invalid document or diagnostic.');
        return;
    }

    const edit = new vscode.WorkspaceEdit();
    const line = diagnostic.range.start.line;

    // Example: Replace `os.system` with `subprocess.run` in Python
    if (document.languageId === 'python') {
        const lineText = document.lineAt(line).text;
        if (lineText.includes('os.system')) {
            const fixedText = lineText.replace(
                /os\.system\(.*\)/,
                'subprocess.run([...], check=True)'
            );
            edit.replace(document.uri, diagnostic.range, fixedText);
        }
    }

    await vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage(`Fixed: ${diagnostic.message}`);
});