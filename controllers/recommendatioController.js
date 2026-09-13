const { spawn } = require("child_process");

const getByCategory = async (req, res) => {
  try {
    const attractionName = req.body.category;

    if (!attractionName) {
      return res.status(400).json({ error: "Attraction name is required" });
    }
    const pythonProcess = spawn("python", [
      "./content_recommendations.py",
      attractionName,
    ]);

    let data = "";

    let errorData = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });
    pythonProcess.stderr.on("data", (chunk) => {
      errorData += chunk.toString();
      console.error("Python error:", chunk.toString());
    });
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ error: "Server error" });
      }
      const recommendations = JSON.parse(data);

      let posts = [];

      recommendations.forEach((rec) => {
        posts.push(rec);
      });

      res.status(200).json({
        posts: posts,
      });
    });
  } catch (err) {
    console.error("Error fetching recommendations:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getByCategory };
