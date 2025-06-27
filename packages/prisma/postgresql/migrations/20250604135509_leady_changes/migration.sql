-- AlterTable

INSERT INTO "Workspace" ("id", "name", "plan", "createdAt", "updatedAt") VALUES ('cmc6vxljy0000to5rrdc93lti', 'leadfy', 'UNLIMITED', '2025-06-07 18:09:34.166', '2025-06-07 18:09:34.166');

INSERT INTO "User" ("id", "onboardingCategories", "createdAt", "email") VALUES ('l6l3kv3g9z6ygmhxdneibt55', '[]', '2025-06-07 18:09:34.166', 'product@leadfy.me');
INSERT INTO "User" ("id", "onboardingCategories", "createdAt", "email") VALUES ('cmc6wuhcw0000ns77fi2m9yj1', '[]', '2025-06-07 18:09:34.166', 'ronny.cruz@leadfy.me');
INSERT INTO "User" ("id", "onboardingCategories", "createdAt", "email") VALUES ('cmc6wv4ik0001ns77wrdadu3d', '[]', '2025-06-07 18:09:34.166', 'luciano.cruz@leadfy.me');
INSERT INTO "User" ("id", "onboardingCategories", "createdAt", "email") VALUES ('cmc6wvbix0002ns77qp9ki26q', '[]', '2025-06-07 18:09:34.166', 'davi.duarte@leadfy.me');

INSERT INTO "ApiToken" ("id", "token", "name", "ownerId", "createdAt") VALUES ('591d3d39-397c-427b-9472-5b8a7bce08d1', 'FajslaoTLdPr0vmqIVl5Mhfa', 'Default', 'l6l3kv3g9z6ygmhxdneibt55', '2025-06-07 18:09:34.166');
INSERT INTO "ApiToken" ("id", "token", "name", "ownerId", "createdAt") VALUES ('591d3d39-397c-427b-9472-5b8a7bce08d2', 'FajslaoTLdPr0vmqIVl5Mhfb', 'Default', 'cmc6wuhcw0000ns77fi2m9yj1', '2025-06-07 18:09:34.166');
INSERT INTO "ApiToken" ("id", "token", "name", "ownerId", "createdAt") VALUES ('591d3d39-397c-427b-9472-5b8a7bce08d3', 'FajslaoTLdPr0vmqIVl5Mhfc', 'Default', 'cmc6wv4ik0001ns77wrdadu3d', '2025-06-07 18:09:34.166');
INSERT INTO "ApiToken" ("id", "token", "name", "ownerId", "createdAt") VALUES ('591d3d39-397c-427b-9472-5b8a7bce08d4', 'FajslaoTLdPr0vmqIVl5Mhfd', 'Default', 'cmc6wvbix0002ns77qp9ki26q', '2025-06-07 18:09:34.166');

INSERT INTO "MemberInWorkspace" ("role", "userId", "workspaceId", "createdAt", "updatedAt") VALUES ('ADMIN', 'l6l3kv3g9z6ygmhxdneibt55', 'cmc6vxljy0000to5rrdc93lti', '2025-06-07 18:09:34.166', '2025-06-07 18:09:34.166');
INSERT INTO "MemberInWorkspace" ("role", "userId", "workspaceId", "createdAt", "updatedAt") VALUES ('ADMIN', 'cmc6wuhcw0000ns77fi2m9yj1', 'cmc6vxljy0000to5rrdc93lti', '2025-06-07 18:09:34.166', '2025-06-07 18:09:34.166');
INSERT INTO "MemberInWorkspace" ("role", "userId", "workspaceId", "createdAt", "updatedAt") VALUES ('ADMIN', 'cmc6wv4ik0001ns77wrdadu3d', 'cmc6vxljy0000to5rrdc93lti', '2025-06-07 18:09:34.166', '2025-06-07 18:09:34.166');
INSERT INTO "MemberInWorkspace" ("role", "userId", "workspaceId", "createdAt", "updatedAt") VALUES ('ADMIN', 'cmc6wvbix0002ns77qp9ki26q', 'cmc6vxljy0000to5rrdc93lti', '2025-06-07 18:09:34.166', '2025-06-07 18:09:34.166');
