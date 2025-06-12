import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Hard-coded skills data
    const skills = [
      {
        id: "programming",
        title: "Programming Languages",
        icon: "Code",
        skills: ["C, C++, C#, Java, R and Python", "JavaScript, TypeScript, HTML, CSS", "SQL, NoSQL"],
      },
      {
        id: "developer-tools",
        title: "Developer Tools",
        icon: "Terminal",
        skills: [
          "Pycharm, Eclipse, Jupyter Notebook",
          "XCode, Visual Studio, VSCode, Code Blocks",
          "Robot Framework, Git, GitHub",
        ],
      },
      {
        id: "libraries",
        title: "Libraries & Frameworks",
        icon: "Library",
        skills: [
          "OpenCV, TensorFlow, PyTorch, Scikit-learn",
          "Seaborn, Selenium, Pandas, NumPy, Matplotlib",
          "OpenAIGym, Nengo, React, Next.js",
        ],
      },
      {
        id: "devops",
        title: "DevOps",
        icon: "Server",
        skills: [
          "CI/CD, GitHub Actions, CodePipeline",
          "Jenkins, Ansible, Docker, Kubernetes",
          "Infrastructure as Code, Terraform",
        ],
      },
      {
        id: "database",
        title: "Database",
        icon: "Database",
        skills: ["PostgreSQL, MySQL, Aurora", "MongoDB, DynamoDB"],
      },
      {
        id: "cloud",
        title: "Cloud",
        icon: "Cloud",
        skills: ["AWS (EC2, S3, Lambda, etc.)", "GCP, Azure"],
      },
    ]

    // Return the skills data as JSON
    return NextResponse.json({ skills }, { status: 200 })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills data" }, { status: 500 })
  }
}
