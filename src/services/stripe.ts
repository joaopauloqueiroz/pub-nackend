import { ErrorCode } from "@consts/error";
import { Result } from "@core/result";
import Stripe from "stripe";

export interface IListProducts {
  starting_after: string;
  ending_before?: string;
}

export interface IStripe {
  createCustomer(
    customer: Stripe.CustomerCreateParams
  ): Promise<Stripe.Customer>;
  createProduct(
    product: Stripe.ProductCreateParams
  ): Promise<Result<Stripe.Product>>;
  createPrice(price: Stripe.PriceCreateParams): Promise<Stripe.Price>;
  listProducts(
    listParams: IListProducts
  ): Promise<Stripe.ApiListPromise<Stripe.Product>>;
  getById(productId: string): Promise<Stripe.Product>;
}

export class StripeService implements IStripe {
  private readonly stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY as string,
    {
      apiVersion: "2020-08-27",
    }
  );
  async getById(productId: string): Promise<Stripe.Product> {
    const product = await this.stripe.products.retrieve(productId);
    return product;
  }
  async createCustomer(
    customer: Stripe.CustomerCreateParams
  ): Promise<Stripe.Customer> {
    try {
      const customerCreated = await this.stripe.customers.create(customer);
      return customerCreated;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(
    product: Stripe.ProductCreateParams
  ): Promise<Result<Stripe.Product>> {
    try {
      const productCreated = await this.stripe.products.create(product);
      return Result.ok(productCreated);
    } catch (error) {
      return Result.fail(ErrorCode.ERROR_CREATING_PRODUCT);
    }
  }

  async createPrice(price: Stripe.PriceCreateParams): Promise<Stripe.Price> {
    try {
      const priceCreated = await this.stripe.prices.create(price);
      return priceCreated;
    } catch (error) {
      throw error;
    }
  }
  async listProducts(
    listParams: IListProducts
  ): Promise<Stripe.ApiListPromise<Stripe.Product>> {
    const products = await this.stripe.products.list({
      limit: 10,
      active: true,
    });

    return products;
  }
}
