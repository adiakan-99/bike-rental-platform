-- =====================================================================
-- V2__seed_roles_permissions.sql
-- Reference data the application depends on at runtime.
-- Place at: src/main/resources/db/migration/V2__seed_roles_permissions.sql
-- =====================================================================

INSERT INTO role (name) VALUES
    ('CUSTOMER'),
    ('PARTNER'),
    ('ADMIN'),
    ('SUPPORT'),
    ('FINANCE');

INSERT INTO permission (key, description) VALUES
    ('booking.create',    'Create a booking'),
    ('booking.viewOwn',   'View own bookings'),
    ('review.create',     'Write a review for a completed rental'),
    ('dispute.raise',     'Dispute a deposit deduction'),
    ('report.raise',      'Report an issue with a rental'),

    ('portal.access',     'Access the partner portal'),
    ('listing.create',    'Create a bike listing'),
    ('listing.viewOwn',   'View own listings'),
    ('inspection.record', 'Record a return inspection'),
    ('earnings.view',     'View own earnings'),

    ('admin.access',      'Access the admin panel'),
    ('partner.approve',   'Approve or reject partner applications'),
    ('bike.approve',      'Approve or reject bike listings'),
    ('dispute.resolve',   'Rule on a disputed deduction'),
    ('user.block',        'Block or unblock a user');

-- CUSTOMER
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM role r, permission p
WHERE r.name = 'CUSTOMER'
  AND p.key IN ('booking.create','booking.viewOwn','review.create',
                'dispute.raise','report.raise');

-- PARTNER
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM role r, permission p
WHERE r.name = 'PARTNER'
  AND p.key IN ('portal.access','listing.create','listing.viewOwn',
                'inspection.record','earnings.view');

-- ADMIN
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM role r, permission p
WHERE r.name = 'ADMIN'
  AND p.key IN ('admin.access','partner.approve','bike.approve',
                'dispute.resolve','user.block');

-- SUPPORT: read-only admin plus the ability to block abusive users
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM role r, permission p
WHERE r.name = 'SUPPORT'
  AND p.key IN ('admin.access','user.block');

-- FINANCE: admin access plus dispute rulings (money movement)
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id FROM role r, permission p
WHERE r.name = 'FINANCE'
  AND p.key IN ('admin.access','dispute.resolve');
