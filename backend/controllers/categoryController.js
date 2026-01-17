const db = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        return res.status(200).json({
            success: true,
            category: category[0]
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching category'
        });
    }
};

const createCategory = async (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Category name is required'
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description || null]
        );
        
        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            categoryId: result.insertId
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating category'
        });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const [existingCategory] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
        
        if (existingCategory.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        await db.query(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description || null, id]
        );

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating category'
        });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const [existingCategory] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
        
        if (existingCategory.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Delete associated templates first
        await db.query('DELETE FROM templates WHERE category_id = ?', [id]);
        
        // Then delete the category
        await db.query('DELETE FROM categories WHERE id = ?', [id]);

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting category'
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
