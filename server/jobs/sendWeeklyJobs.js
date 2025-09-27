import nodemailer from "nodemailer";
import Subscriber from "../models/Subscriber.js";
import Job from "../models/Job.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // App password
  },
});

export const sendWeeklyJobs = async (singleEmail = null) => {
  try {
    // 1. Get top 5 recent jobs
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(5);

    // 2. Create job card HTML
    const jobCardsHtml = jobs
      .map(
        (job) => `
        <div style="border:1px solid #ddd; border-radius:12px; padding:16px; margin-bottom:20px; font-family:Arial, sans-serif;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <img src="${job.imgurl}" alt="Company Logo" style="height:40px; object-fit:contain;" />
          </div>
          <h2 style="margin:12px 0 8px; font-size:18px; color:#111;">${job.title}</h2>
          <p style="font-size:14px; color:#666; line-height:1.4;">
            ${job.description.replace(/<[^>]+>/g, "").slice(0, 150)}...
          </p>
          <div style="margin-top:16px;">
            <a href="https://job-sphere-evolved.vercel.app/apply-job/${job._id}" 
              style="background:#2563eb; color:#fff; padding:10px 16px; border-radius:6px; text-decoration:none; margin-right:8px; font-size:14px;">
              Apply Now
            </a>
            <a href="https://job-sphere-evolved.vercel.app/apply-job/${job._id}" 
              style="border:1px solid #555; color:#555; padding:10px 16px; border-radius:6px; text-decoration:none; font-size:14px;">
              Learn More
            </a>
          </div>
        </div>
      `
      )
      .join("");

    // 3. Wrap in email layout
    const htmlContent = `
      <div style="max-width:600px; margin:auto; padding:20px; font-family:Arial, sans-serif; background:#f9f9f9;">
        <h1 style="text-align:center; color:#2563eb;">🚀 This Week's Top Jobs</h1>
        <p style="text-align:center; font-size:15px; color:#444;">Curated just for you from InternLink</p>
        ${jobCardsHtml}
        <hr style="margin:30px 0;" />
        <p style="font-size:12px; color:#888; text-align:center;">
          You are receiving this email because you subscribed to InternLink.<br/>
          <a href="https://job-sphere-evolved.vercel.app" style="color:#2563eb;">Unsubscribe</a>
        </p>
      </div>
    `;

    // 4. Subscribers
    let subscribers = [];
    if (singleEmail) {
      subscribers = [{ email: singleEmail }];
    } else {
      subscribers = await Subscriber.find();
    }

    // 5. Send emails
    for (const sub of subscribers) {
      await transporter.sendMail({
        from: `"InternLink" <${process.env.MAIL_USER}>`,
        to: sub.email,
        subject: "🚀 Your Weekly Top 5 Jobs from InternLink",
        html: htmlContent,
      });
    }

    console.log("✅ Weekly job emails sent successfully!");
  } catch (error) {
    console.error("❌ Error sending weekly emails:", error);
  }
};
