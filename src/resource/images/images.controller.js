import httpStatus from 'http-status-codes';

const getImages = async (req, res, next) => {
  try {
    const { params } = req;
    const { amount } = params;

    const images = [];

    for (let i = 0; i <= amount; i += 1) {
      images.push(`https://avatars.dicebear.com/v2/avataaars/${i}.svg`);
    }
    res.status(httpStatus.OK).json(images);
  } catch (e) {
    next(e);
  }
};

export { getImages };
