# Contributing to PeerLearn

First off, thank you for considering contributing to PeerLearn! It's people like you that make PeerLearn such a great tool for students worldwide.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to navyadragon04@gmail.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the behavior you expected to see**
* **Explain why this enhancement would be useful**
* **List some other applications where this enhancement exists, if applicable**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript and React style guides
* Include thoughtfully-worded, well-structured tests
* Document new code based on the Documentation Styleguide
* End all files with a newline
* Avoid platform-dependent code

## Development Process

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/peerlearn-platform.git
   cd peerlearn-platform
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/navyadragon04-star/peerlearn-platform.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env.local` file with your Supabase credentials
6. Run the development server:
   ```bash
   npm run dev
   ```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request

### Commit Message Guidelines

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  * 🎨 `:art:` - Improving structure/format of the code
  * ⚡️ `:zap:` - Improving performance
  * 🔥 `:fire:` - Removing code or files
  * 🐛 `:bug:` - Fixing a bug
  * ✨ `:sparkles:` - Introducing new features
  * 📝 `:memo:` - Writing docs
  * 🚀 `:rocket:` - Deploying stuff
  * 💄 `:lipstick:` - Updating the UI and style files
  * ✅ `:white_check_mark:` - Adding tests
  * 🔒 `:lock:` - Fixing security issues
  * ⬆️ `:arrow_up:` - Upgrading dependencies
  * ⬇️ `:arrow_down:` - Downgrading dependencies
  * 🔧 `:wrench:` - Changing configuration files

## Style Guides

### TypeScript Style Guide

* Use TypeScript for all new code
* Use meaningful variable names
* Add types to all function parameters and return values
* Use interfaces for object shapes
* Prefer `const` over `let`, avoid `var`
* Use arrow functions for callbacks
* Use async/await over promises when possible

### React Style Guide

* Use functional components with hooks
* Keep components small and focused
* Use meaningful component names
* Extract reusable logic into custom hooks
* Use proper prop types
* Avoid inline styles, use Tailwind CSS classes
* Keep JSX readable with proper indentation

### Documentation Style Guide

* Use Markdown for documentation
* Reference functions and classes in backticks: `functionName()`
* Use code blocks with language specification
* Include examples where applicable
* Keep documentation up to date with code changes

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Aim for high test coverage
* Test edge cases and error conditions

## Database Changes

If your contribution requires database changes:

1. Create a new migration file in `supabase/migrations/`
2. Use sequential numbering (e.g., `006_your_migration.sql`)
3. Include both up and down migrations if applicable
4. Test migrations thoroughly
5. Document the changes in the migration file
6. Update relevant documentation

## Security

* Never commit sensitive data (API keys, passwords, etc.)
* Use environment variables for configuration
* Follow security best practices
* Report security vulnerabilities privately to navyadragon04@gmail.com

## Legal

By contributing to PeerLearn, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

## Recognition

Contributors will be recognized in our README.md file. Thank you for your contributions!

---

**Happy Contributing! 🎉**
