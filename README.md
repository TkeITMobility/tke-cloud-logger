# TKE Logger

This module behaves as a log factory for any apps we run on the RHMAP.

## API

### getLogger(filename)
Returns a Bunyan logger instance that uses preconfigured streams and log levels
that are appropriate for our environments.


## Logger Behaviour
Loggers have the following behaviours for each method. This behaviour is
achieved by appending custom streams.

### trace
Prints to stdout in DEV only.

### debug
Prints to stdout in DEV and TEST only.

### info
Prints to stdout in all environments.

### warn
Prints to stderr in all environments. Also writes a log to MongoDB.

### error
Prints to stderr in all environments. Also writes a log to MongoDB.

### fatal
Prints to stderr in all environments. Also writes a log to MongoDB.


## MongoDB Logs
Logs of type warn, error, and fatal will also generate a payload that is
written to MongoDB. This payload is the general bunyan JSON log format.

We simply write it to MongoDB for easier tracking, searching and so we can
control when they are deleted.
