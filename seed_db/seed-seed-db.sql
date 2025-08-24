-- Insert roles
INSERT INTO roles (role_name) VALUES ('admin');
INSERT INTO roles (role_name) VALUES ('employee');

-- Insert a sample user
INSERT INTO users (name, email, password) 
VALUES ('rahimi', 'rahimi@example.com', 'password123');

-- Assign role to user
INSERT INTO user_roles (user_id, role_id)
VALUES (1, 1); -- user 1 = rahimi role 1 = admin
