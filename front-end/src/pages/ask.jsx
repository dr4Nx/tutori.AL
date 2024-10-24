import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, getFirestore , doc, getDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "@animxyz/core";
import { XyzTransition } from "@animxyz/react";
import Spinner from "../components/Spinner";
import Marquee from "react-fast-marquee";

const Ask = () => {
  const [subject, setSubject] = useState("");
  const [specificTopic, setSpecificTopic] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        toast.error("You are not Logged In!");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const studentId = user.uid;

      try {
        const docRef = doc(db, 'users', studentId); // Reference to the specific request document
        const docSnap = await getDoc(docRef); // Get the document from Firestore

        if (docSnap.exists()) {
          const studentUsername = docSnap.data().username; // If request exists, set it to state
          const studentEmail = docSnap.data().email;
          setLoading(true);
          await addDoc(collection(db, "requests"), {
            topic: subject,
            description: specificTopic,
            complete: false,
            date_created: serverTimestamp(),
            student_id: studentId,
            student_username: studentUsername,
            student_email: studentEmail,
            tutor_id: null,
            tutor_username: null
          });
          setLoading(false);
  
          // Reset form fields after submission
          setSubject("");
          setSpecificTopic("");
  
          // Optionally, show a success message or redirect
          toast.success("Request submitted successfully!");
        } else {
          setError('Request not found'); // If no such document, set an error message
        }
      } catch (err) {
        console.log(err)
        setError('Failed to fetch request'); // Handle any errors
      }

      try {
        // Add a new document to the 'requests' collection in Firestore

        

      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      navigate("/login");
      toast.error("you are not logged in")
    }

    if (error) return <div>{error}</div>;
  };

  if (loading) return <Spinner />;

  return (
    <>
    <XyzTransition appear xyz="fade down duration-10">
    <div className = "justify-center text-center mt-[15%]">
      <h1 className = "font-poppins font-bold text-[48px] mb-[20px] ">We are happy to help!</h1>
      <div className="bg-lightsage rounded drop-shadow-lg p-10 m-auto text-center min-w-[450px] w-5/12">
        <h1 className="font-bold font-figtree mb-[20px]">What do you need help with?</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="block shadow border-none appearance-none border rounded w-full py-2 px-3 my-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Subject/General Topic (e.g. Calculus III, Math)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="block shadow border-none resize-none appearance-none border rounded w-full h-[150px] py-2 px-3 my-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Specific Help Required (the more specific you are, with more keywords, the better we can match you!)"
            value={specificTopic}
            onChange={(e) => setSpecificTopic(e.target.value)}
          />
          <input
            type="submit"
            className="bg-sage hover:bg-darksage rounded my-3 p-2 text-white"
            value="Submit"
          />
        </form>
      </div>
    </div>
    </XyzTransition>
    <div className="text-[40px] font-bold italic font-figtree mt-[20dvh] w-full">
            <Marquee>
                    BE AT THE FRONTLINES OF EDUCATION FOR ALL.
            </Marquee>
      </div>
    </>
  );
};

export default Ask;
