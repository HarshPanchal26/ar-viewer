// Mock API service - Replace with your actual API endpoint
const API_BASE_URL = "https://prod-api.melzoguru.in"
const MODELS_PER_PAGE = 10

// Static featured models with audio (always shown first)
const staticFeaturedModels = [
  {
    modelId: "static-1",
    modelName: "Astronaut",
    URL: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosModelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
    posterImage: "https://modelviewer.dev/shared-assets/models/Astronaut.webp",
    audioLink: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    modelSize: 4.2,
    dracoSize: 2000,
    hasAR: true,
    hasAudio: true,
    subjectName: "Space Science",
    className: "Featured",
  },
  {
    modelId: "static-2",
    modelName: "RobotExpressive",
    URL: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    iosModelUrl: null,
    posterImage: "https://modelviewer.dev/shared-assets/models/RobotExpressive.webp",
    audioLink: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    modelSize: 5.1,
    dracoSize: 2500,
    hasAR: true,
    hasAudio: true,
    subjectName: "Robotics",
    className: "Featured",
  },
  {
    modelId: "static-3",
    modelName: "Neil Armstrong",
    URL: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    iosModelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.usdz",
    posterImage: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.webp",
    audioLink: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    modelSize: 3.8,
    dracoSize: 1800,
    hasAR: true,
    hasAudio: true,
    subjectName: "History",
    className: "Featured",
  },
]

export function getFeaturedModels() {
  return staticFeaturedModels
}

export async function fetch3dModels(page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/fetchModel/all?page=${page}`)

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()

    const transformedModels = (data.models || []).map((model) => ({
      ...model,
      hasAR: true,
      hasAudio: !!model.audioLink,
    }))

    return {
      models: transformedModels,
      totalCount: data.totalModels || 0,
      isAllModelsFetched: data.isAllModelsFetched || false,
    }
  } catch (error) {
    console.error("API fetch failed:", error)

    return {
      models: [],
      totalCount: 0,
      isAllModelsFetched: true,
      error: error.message,
    }
  }
}
