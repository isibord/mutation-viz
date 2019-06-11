## Mutation-Viz Test Suites
Mutation-Viz contains unit tests as well as more complex integration tests. Both tests are run automatically with `npm test`.

### Integration Test
These test cases are written in `integration.test.ts`. The integration tests attempt to verify the extension's stability by executing real commands in a real Visual Studio Code environment.

Integration Tests are able to:
- Assert on extension's behavior and state within a real VSCode sandbox environment
- Execute various VSCode IDE behaviors and functionalities via the vscode api
- Spy and stub on internal methods

The current limitations of our integration tests:
- No user interactivity. Every action is API driven. 
- Ensuring the tests can run via command line, IDE, and CI/CD pipeline has challenges; particularly in headless environments. Can sometimes disallow us from using certain vscode api.
- Still has access and visibility to the extension implementation, making it not a true black-box test. 


### Unit Tests
Any file that is not named integration.test.ts

Our unit tests cover function and module level behavior. These do not require sandbox environment.

Current Limitations:
- Similar to integration tests, running via command line, IDE, and CI/CD pipeline can require workarounds (particularly for any tests doing file reads).

### How to run tests

`npm test` or execute "Extension Tests" configuration from the VSCode editor. 

As a convenience, you can `skip` tests to help isolate a single case you are interested in:

```
test(() => assertEquals(1+1, 2)) // test will run
test.skip(() => assertEquals(2+2, 4)) // test will not run. don't forget to remove before commiting!
```
