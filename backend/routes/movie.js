const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const databaseConnection = mongoose.createConnection('mongodb://localhost:27017/reviews', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const commentSchema = new mongoose.Schema({
    reviews: String,
    sentiment: String,
});

router.post('/toggle-sentiment', async (req, res) => {
    const { movieId, commentId } = req.body;

    try {
        const MovieCollection = databaseConnection.model(`reviews_${movieId}`, commentSchema);
        console.log("Using collection:", `reviews_${movieId}`);
        console.log("Received movieId:", movieId, "and commentId:", commentId);

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID format' });
        }

        // Find the comment by _id
        const comment = await MovieCollection.findOne({ _id: new mongoose.Types.ObjectId(commentId) });
        console.log("Comment found:", comment);

        if (comment) {
            // Toggle the sentiment
            const newSentiment = comment.sentiment === 'positive' ? 'negative' : 'positive';
            comment.sentiment = newSentiment;
            await comment.save();

            res.json({ message: 'Sentiment toggled successfully', updatedComment: comment });
        } else {
            // res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error toggling sentiment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;