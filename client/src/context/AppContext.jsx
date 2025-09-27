import { createContext, useState, useEffect } from "react";
import axios from "axios"
import { toast } from "react-toastify";
import{useUser, useAuth} from '@clerk/clerk-react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })
    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState([])
    const [exp, setExp] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null);
    const [companyData, setCompanyData] = useState(null);

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    // Function to fetch Jobs

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs`);
            if (!data.success) {
                toast.error(data.message);
                return;
            }

            let jobs = data.jobs;

            // Wait until userData is available
            if (!user) {
                //toast.info("Log in and upload resume to see personalized job recommendations!");
                setJobs(jobs);
                return;
            }

            if (!userData) {
                // user is logged in but backend data not yet fetched
                setJobs(jobs);
                return;
            }

            // If user has a resume embedding
            if (userData.resumeEmbedding && userData.resumeEmbedding.length > 0) {
                const userEmbedding = userData.resumeEmbedding;

                jobs = jobs.map((job) => {
                    if (!job.embedding || job.embedding.length === 0) {
                        // console.log(`Job: ${job.title} | Score: 0 (no embedding)`);
                        return { ...job, score: 0 };
                    }
                    const score = cosineSimilarity(userEmbedding, job.embedding);
                    // console.log(`Job: ${job.title} | Score: ${score.toFixed(4)}`);
                    return { ...job, score };
                });

                jobs.sort((a, b) => a.score - b.score);
            }
            toast.success("Job recommendations are personalized based on your resume!");
            setJobs(jobs);
        } catch (error) {
            toast.error("Failed to fetch jobs: " + error.message);
        }
    };


    // Cosine similarity helper function
    function cosineSimilarity(vecA, vecB) {
        const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
        const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
        return magA && magB ? dot / (magA * magB) : 0;
    }

    // Function to fetch Experiences

    const fetchExperiences = async()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/experiences')
            if(data.success){
                setExp(data.experiences)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to fetch company data

    const fetchCompanyData = async () => {
        try{
            const {data} = await axios.get(backendUrl+'/api/company/company', {headers:{token:companyToken}})
            if(data.success){
                setCompanyData(data.company)
                console.log(data)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    // Function to fetch userData
    const fetchUserData = async() => {
        try {
            const token = await getToken();
            const {data} = await axios.get(backendUrl+'/api/users/user', 
                {headers:{Authorization:`Bearer ${token}`}}
            )
            if(data.success){
                setUserData(data.user)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    // Function to get user's applied application data
    const fetchUserApplications = async() => {
        try{
            const token = await getToken()
            const {data} = await axios.get(backendUrl+'/api/users/applications',
                {headers:{Authorization:`Bearer ${token}`}}
            )

            if(data.success){
                setUserApplications(data.applications)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (!user) {
            fetchJobs(); // show normal jobs
        } else if (userData) {
            fetchJobs(); // show personalized jobs
        }
    }, [user, userData]);

    
    useEffect(()=>{
        fetchJobs()
        fetchExperiences()
        const storedCompanyToken = localStorage.getItem('companyToken')
        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }
    },[])
    
    useEffect(()=>{
        if(companyToken){
            fetchCompanyData()
        }
    },[companyToken])

    useEffect(()=>{
        if(user){
            fetchUserData()
        }
    },[user])

    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    },[user])

    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs, 
        exp, setExp, 
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUserData, fetchUserApplications,
    }
    

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}