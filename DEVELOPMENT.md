# Development Guide

Hello, developer! This guide is intended to be used by developers looking to extend or add to existing functionality of this extension. If you are a user, then you may stop reading and refer to the [usage documentation](README.md)

## Development

The changes required depend on the type of changes that are being made. There are two categories of changes

1. Adding a new feature
    * This means that a new VSCode functionality is being added or an existing one is being improved. For e.g., adding a new mechanism to visualize mutation results.
2. Adding support for a new framework
    * This means that support for running or visualizing reports from a new framrwork is being added.

### Adding a new feature

Adding a new feature  for visualization involves using the result of a `MutationReport` and applying it to some VSCode functionality.

For the list of supported VSCode Extension points, see the [VSCode Extension Developer Guide](https://code.visualstudio.com/api/extension-guides/overview)

A new feature may be added to any file, but if it pertains to an existing feature category, it should be added to the relevant feature's module. For example, improvements to the *Welcome Panel* should be added to `welcomePanel.ts`.

Ensure that your feature is activated when the extension gets activated by adding it to the `activate` function in the `extension.ts` module

```typescript
export function activate(context: vscode.ExtensionContext) {
    // Add your feature activation logic here!
}
```

### Adding a new framework

The parser is the middleware which translates the outputs of the mutation framework into a domain model that is used across all the frontend features.  

Extend the `FrameworkReportParser` interface for the new framework. The `parseReport` method will be given the contents of the report file and returns an instance of a `MutationReport`

```typescript
export class MyFrameworkParser implements FrameworkReportParser {
    parseReport(reportFileContents: string): MutationReport {
        // Implement your logic here!
    }
}
```

Once the parsing logic is implemented, all you need to do is provide an instance of the parser class depending on the configuration of the current user in `factory.ts`

```typescript
export namespace ParserFactory {
    export function getInstance(name: string): FrameworkReportParser {
        if ('SOMEOTHER' == name) {
            return new SomeOtherFrameworkParser();
        +} else if('MYAWESOME' == name) {
        +    return new MyFrameworkParser()
        +}
        else {
            throw `Invalid framework name ${name} provided`
        }
    }
}
```

To add functionality to invoke the framework from the `Mutate` command, add the command for the framework in `mutateCommand.ts`

```typescript
export function mutate() {
    let cmd = "";
    if(mutationFramework === 'MYAWESOME'){
        cmd = "/usr/bin/myframework mutate";
    }
    terminal.sendText(cmd);
}
```

## Testing

### Testing a new feature

* Add a "unit" test following the [official VSCode instructions](https://code.viseualstudio.com/api/working-with-extensions/testing-extension)
  * Note that these are not true unit tests since they run inside a VSCode Development Host but are a close approximation.
* Integration Tests
  * These test end-to-end flow and are present in `integration.test.ts`
* Run `npm test` to ensure existing and new tests are passing before submitting your changes

### Testing a new framework

* Add unit test using `jest` to `parser.spec.ts`
  * Ensure you have added both positive and negative case tests
* Run `npm run test:unit` to ensure existing and new tests are passing before submitting your changes.

For more details on the testing infrastructure, see [here](src/test/README.md).
## Style Guide

The style guied is already enforced for you via a linter!
Ensure you run `npm run lint` before submitting your changes (Or the build will fail, we don't want that, do we?)

The extension uses [TSDoc](https://github.com/microsoft/tsdoc) for code documentation. For a more general TypeScript style guideline, see [here](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md).