import React, { useState, useEffect } from "react";

export const TestMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        console.log("TestMentors: Starting to fetch mentors");
        setLoading(true);

        const response = await fetch("/api/mentors/verified");
        console.log("TestMentors: Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("TestMentors: Data received:", data);
        setMentors(data);
      } catch (err) {
        console.error("TestMentors: Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Mentors Component</h1>

      {loading && <div className="text-blue-600">Loading mentors...</div>}

      {error && <div className="text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Found {mentors.length} mentors
          </h2>
          <div className="space-y-4">
            {mentors.map((mentor: any) => (
              <div key={mentor._id} className="border p-4 rounded">
                <h3 className="font-bold">{mentor.fullName}</h3>
                <p>{mentor.professionalTitle}</p>
                <p className="text-sm text-gray-600">{mentor.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
