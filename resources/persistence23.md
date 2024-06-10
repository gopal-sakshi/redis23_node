`Redis persistence`

RDB
- performs point-in-time snapshots at specified intervals

AOF
- AOF persistence logs every write operation received by the server
- These operations can then be replayed again at server startup, reconstructing the original dataset

No Persistence
- data isnt persisted

RDB + AOF
- combination of both

=============================================================================