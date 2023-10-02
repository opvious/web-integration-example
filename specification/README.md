# Model specification

## Useful commands

```sh
poetry install --all-extras # Install all dependencies
poetry run poe jupyter # Open notebook server to update the local specification
poetry run poe register # Update the specification used by the frontend app
```

The last command requires an Opvious API token stored as `OPVIOUS_TOKEN`
environment variable.


## Next steps

Before using a model in production, we recommend adding unit-tests for the
model. If the model will be updated regularly, we also highly encourage
automating the registration command above. A common pattern is to run a CI
workflow on pushes to the main branch which runs all tests and registers the
model (only) if all tests succeed.
