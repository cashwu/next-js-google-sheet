'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [people, setPeople] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/getPublicSheetData');
      const data = await response.json();
      setPeople(data.people);
      setSkills(data.skills);
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">人員和技能列表</h1>
      <div className="flex justify-between w-full">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">人員列表</h2>
          <ul>
            {people.map((person) => (
              <li key={person.id} className="mb-2">
                {Object.entries(person).map(([key, value]) => (
                  <span key={key} className="mr-2">
                    {key}: {value}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4">技能列表</h2>
          <ul>
            {skills.map((skill) => (
              <li key={skill.id} className="mb-2">
                {Object.entries(skill).map(([key, value]) => (
                  <span key={key} className="mr-2">
                    {key}: {value}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}