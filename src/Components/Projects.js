import "./Projects.css";

function Projects() {
  return (
    <div className="project">
      <h1>Featured Projects</h1>
      <h3>A selection of my recent work and personal projects</h3>

      <div className="project_session">
        {Projectdata.map((project) => (
          <div className="project_card" key={project.id}>
            <div className="image">
              <img src={project.img} alt={project.name} />
            </div>
            <h3>{project.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;

// Example Project Data (6 cards)
const Projectdata = [
  { id: 1, img: "https://images.unsplash.com/photo-1577215451400-f207c63e30be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhcmJ1Y2tzfGVufDB8fDB8fHww",
     name: "StarBucks clone" },
  { id: 2, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGYe5ZOFKRFjNfJBpSVRJtboOvgWG3DSgWEA&s",
     name: "Movie booking react project" },
  { id: 3, img: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbGN1bGF0b3J8ZW58MHx8MHx8fDA%3D",
     name: "Calculator" },
  { id: 4, img: "https://plus.unsplash.com/premium_photo-1684785618727-378a3a5e91c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGUlMjBjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D", name: "Ecommerce website" },
  { id: 5, img: "https://images.unsplash.com/photo-1580574252456-5279e8470478?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fERpZ2l0YWwlMjBjbG9ja3xlbnwwfHwwfHx8MA%3D%3D", name: "Digital clock" },
  { id: 6, img: "https://plus.unsplash.com/premium_photo-1687509673978-c5dfd1f8ef5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydGZvbGlvJTIwdGV4dHxlbnwwfHwwfHx8MA%3D%3D", name: "Personal Portfolio" },
];
