-- Insert default categories
INSERT INTO categories (name, description) VALUES
('M Team', 'Management Team meetings'),
('Academic', 'Academic department meetings'),
('COA', 'Committee of Advisors meetings'),
('Skill', 'Skill development meetings'),
('Business', 'Business-related meetings')
ON DUPLICATE KEY UPDATE name = name;
