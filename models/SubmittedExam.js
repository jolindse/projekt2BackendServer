/**
 * Created by Johan on 2016-04-22.
 *
 * Entity model for submitted exam
 *
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var submittedSchema = mongoose.Schema({

    // Basic information
    student: {
        type: String,
        required: true
    },
    exam: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    comment: {
        type: String
    },
    completeCorrection: {
        type: Boolean,
        default: false
    },
    grade: {
        type: String
    },
    points: {
        type: Number
    },
    startTime: {
        type: String
    }
});

// Export model for application use.
var SubmittedExam = module.exports = mongoose.model('SubmittedExam', submittedSchema);

/*
 Functions for the entity
 */

// Get a submitted exam
module.exports.getSubmitted = function (id, callback) {
    SubmittedExam.findById(id, callback);
};

// Add a submitted exam
module.exports.addSubmitted = function (submittedData, callback) {
    SubmittedExam.create(submittedData, callback);
};

// Update a submitted exam
module.exports.updateSubmitted = function (id, updatedSubmitted, callback) {
    SubmittedExam.findOneAndUpdate(
        {_id: id},
        updatedSubmitted,
        {upsert: false},
        callback
    );
    
};

// Delete a submitted exam
module.exports.deleteSubmitted = function (id, callback) {
    SubmittedExam.findOneAndRemove({_id: id}, callback);
};

// Get all submitted exams by a student
module.exports.getByUser = function (id, callback) {
    SubmittedExam.find({student: id}, callback);
};

// Get all submitted exams to a specific test
module.exports.getByExam = function (id, callback) {
    SubmittedExam.find({exam: id}, callback);
};

// Get all submitted exams from a student
module.exports.getByStudent = function (id, callback) {
    SubmittedExam.find({student: id}, callback);
};


// Get all submitted exams not completly corrected
module.exports.getExamsNeedCorrection = function(callback) {
    SubmittedExam.find({completeCorrection: false}, callback);
};

// Removes all submitted exams from student
module.exports.removeStudent = function (id) {
    console.log('removeStudent; Id in ' + id); // TEST
    SubmittedExam.find({'student': {$in: [id]}}, function (err, currSub) {
        currSub.forEach(function (subToRemove) {
            SubmittedExam.deleteSubmitted(subToRemove._id, function (err) {
                if (err) {
                    console.log("Error removing submitted from student with id " + id);
                }
            });
        });
    });
};
