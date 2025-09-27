import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const [JobData, setJobData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);
      if (!userData) {
        return toast.error("Login to apply for jobs");
      }
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Check if user already applied
  const checkAlreadyApplied = () => {
    if (!Array.isArray(userApplications) || !JobData?._id) {
      setIsAlreadyApplied(false);
      return;
    }
    const hasApplied = userApplications.some(
      (item) => item?.jobId?._id && item.jobId._id === JobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  // 🔑 Save application only if user confirms
  const confirmApplyHandler = async () => {
    if (!userData) {
      return toast.error("Login to apply for jobs");
    }
    const token = await getToken();
    const { data } = await axios.post(
      backendUrl + "/api/users/apply",
      { jobId: JobData._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (data.success) {
      toast.success("Added to your action center.");
      fetchUserApplications();
    } else {
      toast.error(data.message);
    }
    setShowConfirm(false);
  };

  // 🔑 Opens external link + shows modal
  const applyHandler = () => {
    if (!userData) {
      return toast.error("Login to apply for jobs");
    }
    if (JobData?.link) {
      window.open(JobData.link, "_blank", "noopener,noreferrer");
      setShowConfirm(true);
    } else {
      toast.error("Job application link not found");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    checkAlreadyApplied();
  }, [JobData, userApplications]);

  return JobData ? (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-ful">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl ">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={JobData.imgurl}
                alt=""
              />
              <div className="text-center md:text-left text-nuetral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {JobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex item-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.name}
                  </span>
                  <span className="flex item-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex item-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex item-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC:{JobData.salary} INR
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyHandler}
                className={`p-2.5 px-10 rounded ${
                  isAlreadyApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                }`}
                disabled={isAlreadyApplied}
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start">
          <div className="w-full lg:w-2/3">
            <h2 className="font-bold text-2xl mb-4">Job Description</h2>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: JobData.description }}
            ></div>
            <button
              onClick={applyHandler}
              className={`p-2.5 px-10 rounded mt-10 ${
                isAlreadyApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
              disabled={isAlreadyApplied}
            >
              {isAlreadyApplied ? "Already Applied" : "Apply Now"}
            </button>
          </div>

          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
            <h2>More jobs from {JobData.companyId.name}</h2>
            {jobs
              .filter(
                (job) =>
                  job._id !== JobData._id &&
                  job.companyId._id === JobData.companyId._id
              )
              .filter((job) => {
                const appliedJobsIds = new Set(
                  userApplications.map((app) => app.jobId && app.jobId._id)
                );
                return !appliedJobsIds.has(job._id);
              })
              .slice(0, 4)
              .map((job, index) => (
                <JobCard key={index} job={job} />
              ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* 🔑 Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">
              Did you complete the job application?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmApplyHandler}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-black px-6 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
