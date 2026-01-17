const express = require('express');
const router = express.Router();
const {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    templateList,
    searchTemplates,
    deleteTemplate,
    getCategories,
    getUsers,
    getVenue
} = require('../controllers/templateController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, createTemplate);
router.get("/users", authenticateToken, getUsers);
router.get("/venues", getVenue);
router.get('/s', searchTemplates);
router.get('/', getTemplates);
router.get('/categories', getCategories);
router.get('/list', templateList);
router.get('/:id', authenticateToken, getTemplateById);
router.put('/update/:id', authenticateToken, updateTemplate); 
router.delete('/delete/:id', authenticateToken, deleteTemplate);

module.exports = router;