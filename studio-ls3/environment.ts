function assertValue(value: string | undefined, errorMessage: string) {
  if (!value) {
    throw new Error(errorMessage)
  }

  return value
}

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID',
)

export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET,
  'Missing environment variable: SANITY_STUDIO_DATASET',
)
