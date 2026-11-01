# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Strict Ownership (`userId`)**: Every document in `/applications/{applicationId}` MUST belong exclusively to the authenticated citizen (`resource.data.userId == request.auth.uid` on read/update/delete, and `request.resource.data.userId == request.auth.uid` on create).
2. **Verified Email Requirement**: Standard write operations require `request.auth.token.email_verified == true`.
3. **Subcollection Master Gate (`/applications/{applicationId}/documents/{documentId}`)**: Any access to a subcollection document MUST verify that the parent `/applications/{applicationId}` exists and its `userId` matches `request.auth.uid`.
4. **Immutable Identity & Creation Fields**: `id`, `userId`, `serviceId`, and `createdAt` cannot be modified after creation.
5. **Server Timestamp Enforcement**: `createdAt` must equal `request.time` on creation, and `updatedAt` must equal `request.time` on both creation and update.
6. **Bounded Arrays & Strings**: All strings have explicit `.size() <= MAX` limits; arrays (`documents`, `auditTrail`, `followUpCalls`) are strictly bounded (`<= 20` or `<= 50`).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Read/Write**: `auth = null` attempting `get` or `create` on `/applications/app-1` -> `PERMISSION_DENIED`.
2. **Cross-Citizen PII Read**: `auth.uid = 'attacker-uid'` attempting `get` on `/applications/app-victim` where `userId == 'victim-uid'` -> `PERMISSION_DENIED`.
3. **Unfiltered List Scraping**: `auth.uid = 'attacker-uid'` attempting `list` on `/applications` without `where('userId', '==', 'attacker-uid')` -> `PERMISSION_DENIED`.
4. **Identity Spoofing on Create**: `auth.uid = 'user-1'` creating `/applications/app-1` with `userId: 'user-2'` -> `PERMISSION_DENIED`.
5. **Unverified Email Write**: `auth.token.email_verified = false` attempting to create `/applications/app-1` -> `PERMISSION_DENIED`.
6. **Shadow Field Injection on Create**: Creating `/applications/app-1` with an undeclared field `isAdminOverride: true` -> `PERMISSION_DENIED`.
7. **Shadow Field Injection on Update**: Updating `/applications/app-1` with an undeclared field `internalFlag: 'bypass'` -> `PERMISSION_DENIED`.
8. **Ownership Transfer on Update**: Updating `userId` from `'user-1'` to `'user-2'` -> `PERMISSION_DENIED`.
9. **Creation Timestamp Tampering**: Forging `createdAt` to a past timestamp on `create` or modifying `createdAt` on `update` -> `PERMISSION_DENIED`.
10. **ID Poisoning**: Creating a document with an invalid ID containing spaces/special characters or `> 128` chars -> `PERMISSION_DENIED`.
11. **Array Exhaustion ("Denial of Wallet")**: Sending `auditTrail` with 500 elements (`> 50`) -> `PERMISSION_DENIED`.
12. **Orphaned Subcollection Write**: Writing to `/applications/non-existent-app/documents/doc-1` or to another user's application subcollection -> `PERMISSION_DENIED`.
