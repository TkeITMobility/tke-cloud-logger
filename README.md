# TKE Logger

This module behaves as a log factory for any apps we run on the RHMAP.

## API

### getLogger([filename])
Returns a Bunyan logger instance that uses preconfigured streams and log levels
that are appropriate for our environments.
If a filename is not provided, the logger will use the name of the file  that is 
calling getLogger().


## Logger Behaviour
- Local and Dev: Prints *all log levels* including `trace` and `debug`
- Test, Pre-Prod, and Prod: Prints log levels `info`, `warn`, `error`, and `fatal`
