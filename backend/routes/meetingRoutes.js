const express = require('express');
const router = express.Router();
const {
    createMeeting,
    assignResponsibility,
    getMeetingbyId,
    getUserResponsibilities,
    setTodoForPoint,
    markAttendance,
    forwardMeetingPoint,
    updateMeeting,
    getUserMeetings,
    rejectMeeting,
    getUserRejectionsById,
    getAttendanceRecords,
    approvePoint,
    addAdminRemarks,
    getMeetingAgenda,
    endMeeting,
    startMeeting,
    getAllMeetings,
    getPoints,
    respondToMeetingInvite,
    getUserMeetingResponse,
    getMeetingStatus,
    updatePoint,
    getForwardedPoints
} = require('../controllers/meetingController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, createMeeting)
router.post('/assign-responsibility', authenticateToken, assignResponsibility)
router.get('/get-calender-details', getAllMeetings)
router.get('/get-user-meetings', authenticateToken, getUserMeetings)
router.post('/get-responsibility', authenticateToken, getUserResponsibilities)
router.post('/set-todo', authenticateToken, setTodoForPoint)
router.post('/mark-attendence', authenticateToken, markAttendance)
router.post('/forward-point', authenticateToken, forwardMeetingPoint)
router.post('/update', authenticateToken, updateMeeting)
router.post('/reject', authenticateToken, rejectMeeting)
router.get('/get-rejection-records/:id', getUserRejectionsById)
router.get('/get-attendance-records/:id', getAttendanceRecords)
router.post('/approve-point', authenticateToken, approvePoint)
router.post('/add-admin-remarks', authenticateToken, addAdminRemarks)
router.get('/get-meeting-agenda/:id', authenticateToken, getMeetingAgenda)
router.post('/start-meeting', authenticateToken, startMeeting)
router.post('/end-meeting', authenticateToken, endMeeting)
router.get('/meeting/:id', authenticateToken, getMeetingbyId)
router.get('/:meetingId/points', authenticateToken, getPoints)
router.post('/respond', authenticateToken, respondToMeetingInvite)
router.post('/get-response', authenticateToken, getUserMeetingResponse)
router.get('/get-meeting-status/:meetingId', authenticateToken, getMeetingStatus)
router.post('/update-point', authenticateToken, updatePoint)
router.post('/get-forwarded-points', authenticateToken, getForwardedPoints)



module.exports = router;