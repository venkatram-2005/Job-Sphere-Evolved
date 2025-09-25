import Navbar from "../components/Navbar";

const Analyzer = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at top */}
      <Navbar />

      {/* iFrame takes the rest of the space */}
      <div className="flex-1">
        <iframe
          src="https://jobsphere-resume-analyzer.vercel.app/" // <-- replace with actual URL
          className="w-full h-full border-0"
          title="Resume Analyzer"
        />
      </div>
    </div>
  );
};

export default Analyzer;
