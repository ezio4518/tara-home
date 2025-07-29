// import React, { useState, useRef, useEffect } from "react";
// import { GoLightBulb } from "react-icons/go";
// import PulseLoader from "react-spinners/PulseLoader";

// const FloatingFeedback = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [form, setForm] = useState({ name: "", email: "", issue: "" });
//   const [status, setStatus] = useState("idle"); // idle, submitting, submitted, error
//   const feedbackRef = useRef(null);

//   // Get your Formspree endpoint from your .env file
//   const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.email.trim() || !form.issue.trim()) {
//       alert("Please fill out all fields.");
//       return;
//     }
//     setStatus("submitting");

//     try {
//       const response = await fetch(FORMSPREE_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });

//       if (response.ok) {
//         setStatus("submitted");
//         setForm({ name: "", email: "", issue: "" });
//       } else {
//         throw new Error('Failed to submit feedback.');
//       }
//     } catch (error) {
//       console.error("Feedback submission error:", error);
//       setStatus("error");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         feedbackRef.current &&
//         !feedbackRef.current.contains(e.target) &&
//         !e.target.closest("#floating-feedback-toggle")
//       ) {
//         setIsOpen(false);
//       }
//     };
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen) {
//       setStatus("idle");
//     }
//   }, [isOpen]);

//   return (
//     <>
//       {isOpen && (
//         <div
//           ref={feedbackRef}
//           // --- Position updated to open on the left ---
//           className="fixed bottom-28 left-8 w-[420px] bg-white shadow-xl border border-[#A1876F] rounded-xl p-4 z-50 flex flex-col"
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-bold text-[#40350A]">Feedback & Issues</h2>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-2xl text-[#A1876F] hover:text-[#40350A]"
//             >
//               &times;
//             </button>
//           </div>
          
//           {status === 'submitted' ? (
//             <div className="flex flex-col items-center justify-center h-full text-center">
//               <h3 className="text-xl font-semibold text-[#40350A]">Thank You!</h3>
//               <p className="text-gray-600 mt-2">Your feedback has been received.</p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Your Name"
//                 value={form.name}
//                 onChange={handleInputChange}
//                 className="border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Your Email"
//                 value={form.email}
//                 onChange={handleInputChange}
//                 className="border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none"
//                 required
//               />
//               <textarea
//                 name="issue"
//                 placeholder="Describe your feedback or issue..."
//                 value={form.issue}
//                 onChange={handleInputChange}
//                 className="border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none h-32 resize-none"
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={status === 'submitting'}
//                 className="text-sm bg-[#40350A] text-white px-4 py-2 rounded hover:bg-[#5a4812] disabled:bg-gray-400 flex justify-center"
//               >
//                 {status === 'submitting' ? (
//                   <PulseLoader size={8} color="#FFFFFF" />
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//               {status === 'error' && <p className="text-red-500 text-sm text-center">Failed to submit. Please try again.</p>}
//             </form>
//           )}
//         </div>
//       )}

//       {/* Floating Toggle Button on the left */}
//       <button
//         id="floating-feedback-toggle"
//         className="fixed bottom-6 left-6 bg-[#A1876F] text-white p-5 rounded-full shadow-xl z-50 hover:bg-[#866e58] transition"
//         onClick={() => setIsOpen((prev) => !prev)}
//         aria-label="Toggle feedback form"
//       >
//         <GoLightBulb size={34} />
//       </button>
//     </>
//   );
// };

// export default FloatingFeedback;

import React, { useState, useRef, useEffect } from "react";
import { GoLightBulb } from "react-icons/go";
import PulseLoader from "react-spinners/PulseLoader";

const FloatingFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", issue: "" });
  const [status, setStatus] = useState("idle"); // idle, submitting, submitted, error
  const feedbackRef = useRef(null);

  const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.issue.trim()) {
      alert("Please fill out all fields.");
      return;
    }
    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("submitted");
        setForm({ name: "", email: "", issue: "" });
      } else {
        throw new Error('Failed to submit feedback.');
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        feedbackRef.current &&
        !feedbackRef.current.contains(e.target) &&
        !e.target.closest("#floating-feedback-toggle")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={feedbackRef}
          className="fixed bottom-28 left-4 right-4 md:w-[420px] md:right-auto md:left-8 bg-white shadow-xl border border-[#A1876F] rounded-xl p-4 z-50 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#40350A]">Feedback & Issues</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-[#A1876F] hover:text-[#40350A]"
            >
              &times;
            </button>
          </div>
          
          {status === 'submitted' ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <h3 className="text-xl font-semibold text-[#40350A]">Thank You!</h3>
              <p className="text-gray-600 mt-2">Your feedback has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleInputChange}
                className="border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleInputChange}
                className="border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none"
                required
              />
              <textarea
                name="issue"
                placeholder="Describe your feedback or issue..."
                value={form.issue}
                onChange={handleInputChange}
                className="border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none h-32 resize-none"
                required
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="text-sm bg-[#40350A] text-white px-4 py-2 rounded hover:bg-[#5a4812] disabled:bg-gray-400 flex justify-center"
              >
                {status === 'submitting' ? (
                  <PulseLoader size={8} color="#FFFFFF" />
                ) : (
                  "Submit"
                )}
              </button>
              {status === 'error' && <p className="text-red-500 text-sm text-center">Failed to submit. Please try again.</p>}
            </form>
          )}
        </div>
      )}

      {/* Floating Toggle Button on the left */}
      <button
        id="floating-feedback-toggle"
        className="fixed bottom-6 left-6 bg-[#A1876F] text-white p-5 rounded-full shadow-xl z-50 hover:bg-[#866e58] transition"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle feedback form"
      >
        <GoLightBulb size={34} />
      </button>
    </>
  );
};

export default FloatingFeedback;