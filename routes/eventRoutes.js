const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");


router.get('/user/:user_id', eventController.getEventsForAuthenticatedUser);


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       404:
 *         description: No events found
 */
router.get("/", eventController.getAllEvents);


/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: Search events by keyword
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search events
 *     responses:
 *       200:
 *         description: Search successful
 *       404:
 *         description: No events found matching the search
 */
router.get("/search", eventController.searchEvents);

/**
 * @swagger
 * /events/date:
 *   get:
 *     summary: Get events by exact date
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Events for date retrieved
 *       404:
 *         description: No events found on that date
 */
router.get("/date", eventController.getEventsByExactDate);

/**
 * @swagger
 * /events/{event_id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */

router.get("/user/", eventController.getEventsByUserId);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               event_start_time:
 *                 type: string
 *                 format: date-time
 *               event_end_time:
 *                 type: string
 *                 format: date-time
 *               invitees:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Missing required fields
 */

router.get("/:event_id", eventController.getEventById);

/**
 * @swagger
 * /events/user/{user_id}:
 *   get:
 *     summary: Get events by user ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's events retrieved successfully
 *       404:
 *         description: No events found for user
 */
router.post("/", eventController.createEvent);

/**
 * @swagger
 * /events/{event_id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               event_start_time:
 *                 type: string
 *                 format: date-time
 *               event_end_time:
 *                 type: string
 *                 format: date-time
 *               invitees:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put("/:event_id", eventController.updateEvent);

/**
 * @swagger
 * /events/{event_id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/:event_id", eventController.deleteEvent);

/**
 * @swagger
 * /events/{invitationId}/accept:
 *   patch:
 *     summary: Accept an event invitation
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invitation ID
 *     responses:
 *       200:
 *         description: Invitation accepted
 *       404:
 *         description: Invitation not found or already processed
 */
router.patch('/:invitationId/accept', eventController.acceptInvitation);

/**
 * @swagger
 * /events/{invitationId}/reject:
 *   patch:
 *     summary: Reject an event invitation
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Invitation ID
 *     responses:
 *       200:
 *         description: Invitation rejected
 *       404:
 *         description: Invitation not found or already processed
 */
router.patch('/:invitationId/reject', eventController.rejectInvitation);

module.exports = router;