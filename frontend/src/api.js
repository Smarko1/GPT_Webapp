import axios from 'axios';

export const generateArticles = async (topic) => {
  const res = await axios.post('/', { topic });
  return response.data.articles;
};
