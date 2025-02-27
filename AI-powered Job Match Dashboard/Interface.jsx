
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardActions, Modal, Box, Alert } from "@mui/material";
import { Button, LinearProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const userSkills = ["JavaScript", "SQL"];

const getProgress = (match) => {
  if (match >= 80) return "#4CAF50"; // Green
  if (match >= 50) return "#FFC107"; // Yellow
  return "#F44336"; // Red
};
const getScore = (match) => {
  if (match >= 80) return 'text-green-500'
  if (match >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

export default function Interface() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);


  useEffect(() => {
    fetch("/jobsData.json")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching job data:", error));
  }, []);

  const applyForJob = (id) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
    }
  };

  const getMissingSkills = (jobSkills) => {
    return jobSkills.filter(skill => !userSkills.includes(skill));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Typography variant="h4" gutterBottom>Job Match Dashboard</Typography>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <motion.div key={job.id} whileHover={{ scale: 1.02 }}>
            <Card className="p-4 shadow-lg rounded-2xl" onClick={() => setSelectedJob(job)}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="textSecondary">{job.company}</Typography>
                <div className="mt-2">
                  <Typography variant="body2"  className={getScore(job.matchScore)}>
                    Match Score: {job.matchScore}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={job.matchScore} 
                    className="mt-1" 
                    sx={{'& .MuiLinearProgress-bar': { backgroundColor: getProgress(job.matchScore) }}}
                  />
                </div>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => { e.stopPropagation(); applyForJob(job.id); }}
                  disabled={appliedJobs.includes(job.id)}
                >
                  {appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
          {selectedJob && (
            <>
              <Typography variant="h5" gutterBottom>{selectedJob.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">{selectedJob.company}</Typography>
              <Typography variant="body1" className="mt-2">Required Skills:</Typography>
              <ul>
                {selectedJob.skills.map((skill, index) => (
                  <li key={index}><Typography variant="body2">• {skill}</Typography></li>
                ))}
              </ul>

              {getMissingSkills(selectedJob.skills).length > 0 && (
                <Alert severity="warning" className="mt-3">
                  You are missing the following skills: {getMissingSkills(selectedJob.skills).join(", ")}.
                  Consider upskilling to improve your match!
                </Alert>
              )}

              <Button fullWidth variant="contained" color="secondary" onClick={() => setSelectedJob(null)} className="mt-4">Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
