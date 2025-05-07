import React from "react";

const NewsletterBox = () => {
  // Handler for form submission
  // This function prevents the default form submission behavior ie marking it fill and not reaload page after submitting it
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className=" text-center">
      <p className="text-2xl font-medium" style={{ color: "#40350A" }}>
        Subscribe now & get 20% off
      </p>

      <p className="text-gray-400 mt-3">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6  pl-3" style={{ borderColor: '#5B3720', borderWidth: '2px' }}
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          required
          style={{ color: '#A1876F' }}
        />
        <button
          type="submit"
          className="text-xs px-10 py-4"
          style={{ backgroundColor: "#5B3720", color: "#F0E1C6" }}
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
