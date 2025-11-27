/**
 * Clean and parse a JSON string by removing any leading or trailing whitespace,
 * and removing any leading or trailing whitespace from the string.
 *
 * @author Salman
 * @param jsonString The JSON string to clean and parse.
 * @returns The parsed JSON object, or null if the string is not a valid JSON.
 */
const cleanAndParseJsonString = (jsonString: string) => {
  try {
    const json = jsonString
      .replace(/```[\s\S]*?json/g, '') // remove ```json
      .replace(/```/g, '') // remove closing ```
      .trim();

    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

export { cleanAndParseJsonString };
