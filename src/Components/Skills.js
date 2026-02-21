import "./Skills.css";
// FaNodeJs ko yahan add karein
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaBootstrap, FaNodeJs } from "react-icons/fa";
// SiNodejs ko yahan se hata dein
import { SiMongodb, SiExpress} from "react-icons/si";

function Skills() {
  const skillsData = [
    { id: 1, name: "HTML", icon: <FaHtml5 />, color: "#E34F26" },
    { id: 2, name: "CSS", icon: <FaCss3Alt />, color: "#1572B6" },
    { id: 3, name: "JavaScript", icon: <FaJs />, color: "#F7DF1E" },
    { id: 4, name: "React JS", icon: <FaReact />, color: "#61DAFB" },
    { id: 5, name: "Node.js", icon: <FaNodeJs />, color: "#339933" },
    { id: 6, name: "Express JS", icon: <SiExpress />, color: "#000000" }, // Added
    { id: 7, name: "MongoDB", icon: <SiMongodb />, color: "#47A248" }, // Added
    { id: 10, name: "Git", icon: <FaGitAlt />, color: "#F05032" },
    { id: 11, name: "Bootstrap", icon: <FaBootstrap />, color: "#7952B3" },
  ];

  return (
    <div className="skills">
      <h1>My Skills</h1>

      <div className="skills-container">
        {skillsData.map((skill) => (
          <div className="skill-card" key={skill.id}>
            <div
              className="skill-icon"
              style={{ color: skill.color }}
            >
              {skill.icon}
            </div>
            <h3>{skill.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;