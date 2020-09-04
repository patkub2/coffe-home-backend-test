const bcrypt = require("bcryptjs");

const Product = require("../../models/product");
const User = require("../../models/user");

const products = async (productIds) => {
  try {
    const products = await Product.find({ _id: { $in: productIds } });
    products.map((product) => {
      return {
        ...product._doc,
        _id: product.id,
        creator: user.bind(this, product.creator),
      };
    });
    return products;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdProducts: products.bind(this, user._doc.createdProducts),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  products: async () => {
    try {
      const products = await Product.find();
      return products.map((product) => {
        return {
          ...product._doc,
          _id: product.id,
          creator: user.bind(this, product._doc.creator),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createProduct: async (args) => {
    const product = new Product({
      title: args.productInput.title,
      description: args.productInput.description,
      price: +args.productInput.price,
      category: args.productInput.category,
      creator: "5f52816ff7d12e0348d34e32",
    });
    let createdProduct;
    try {
      const result = await product.save();
      createdProduct = {
        ...result._doc,
        _id: result._doc._id.toString(),
        category: product._doc.category,
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById("5f52816ff7d12e0348d34e32");

      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdProducts.push(product);
      await creator.save();

      return createdProduct;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
};
