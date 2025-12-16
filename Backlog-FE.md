Frontend backlog (derived from Backend changes)

You can create these as separate FE tasks; I’ll map them to backend IDs.
Epic FE-A — Pagination + removal of unbounded calls
ID	Priority	Effort	Frontend ticket	Depends on
FE-001	P0	M	Update all list views to use paginated requests (page/size/sort) and UI paging controls	BE-001
FE-002	P0	S	Remove any use of ?unpaged=true	BE-002
FE-003	P0	S	Remove any use of /all endpoints	BE-003
FE-004	P1	M	If “download all data” is needed: implement export UX using new /export endpoint (admin-only)	BE-004
Epic FE-B — Unified error handling (ProblemDetail)
ID	Priority	Effort	Frontend ticket	Depends on
FE-010	P0	M	Update API client to parse and display ProblemDetail consistently (toast + inline field errors)	BE-020, BE-022
FE-011	P1	S	Capture and display X-Request-Id in error UI / bug reports	BE-021
Epic FE-C — DTO migration coordination
ID	Priority	Effort	Frontend ticket	Depends on
FE-020	P0	M	Introduce typed API layer (TypeScript interfaces) that matches DTO responses per resource	BE-030..039
FE-021	P0	M	Plan migration strategy with backend: /api/v2 vs flag/header; implement switching mechanism	BE-040
FE-022	P1	M	Update Country screens to new DTOs (list, details, rankings, compare)	BE-031, BE-050
FE-023	P1	M	Update Engine screens to new DTOs (filters + compare)	BE-032
FE-024	P2	M	Update LaunchVehicle screens to new DTOs	BE-033
FE-025	P2	M	Update Mission screens to new DTOs	BE-034
FE-026	P2	M	Update Satellite screens to new DTOs	BE-035
FE-027	P2	M	Update LaunchSite screens to new DTOs	BE-036
FE-028	P2	M	Update Milestone screens to new DTOs	BE-037
FE-029	P2	M	Update CapabilityScore screens to new DTOs	BE-038
Epic FE-D — Analytics UX (if responses change or get richer)
ID	Priority	Effort	Frontend ticket	Depends on
FE-030	P1	M	Update analytics summary UI to match new explicit DTO fields	BE-052
FE-031	P1	M	Update “launches per year by country” charts to match new API output + handle missing years cleanly	BE-053
FE-032	P2	S	Update “records” UI to match new DTO output	BE-054
Epic FE-E — External sync admin UI (optional but recommended)
ID	Priority	Effort	Frontend ticket	Depends on
FE-040	P2	M	Add admin panel: view sync status + trigger sync + show last error	BE-061, BE-063
