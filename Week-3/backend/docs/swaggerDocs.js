/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         userId:
 *           type: string
 *           description: ID of the created user
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The product ID
 *         product_name:
 *           type: string
 *           description: Name of the product
 *         product_description:
 *           type: string
 *           description: Description of the product
 *         product_price:
 *           type: number
 *           description: Price of the product
 *         profile_pic:
 *           type: string
 *           description: URL or identifier for the product image
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The category ID
 *         name:
 *           type: string
 *           description: Name of the category
 *     Vendor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The vendor ID
 *         name:
 *           type: string
 *           description: Name of the vendor
 *         email:
 *           type: string
 *           description: Email of the vendor
 *
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 *
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *
 * /refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     description: Generates a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *       401:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid or expired refresh token
 *       404:
 *         description: User not found
 *
 * /logout:
 *   post:
 *     summary: Log out user
 *     tags: [Authentication]
 *     description: Logs out the user by deleting the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: Refresh token is required
 *
 * /user-details:
 *   get:
 *     summary: Get user details
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     description: Fetches details of the authenticated user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *
 * /upload-profile-photo:
 *   post:
 *     summary: Upload user profile photo
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     description: Uploads a new profile picture for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_pic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Server error
 *
 * /vendors/count:
 *   get:
 *     summary: Get vendor count
 *     tags: [Vendors]
 *     security:
 *       - BearerAuth: []
 *     description: Returns the total number of registered vendors.
 *     responses:
 *       200:
 *         description: Vendor count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of vendors
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves a list of all available products.
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     description: Adds a new product to the database. Only accessible by admin or manager.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 description: Name of the product
 *               product_description:
 *                 type: string
 *                 description: Description of the product
 *               product_price:
 *                 type: number
 *                 description: Price of the product
 *               profile_pic:
 *                 type: string
 *                 format: binary
 *                 description: Image of the product
 *     responses:
 *       200:
 *         description: Product added successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (user does not have the required role)
 *       500:
 *         description: Server error
 *
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves a list of all available categories.
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *
 * /vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves a list of all available vendors.
 *     responses:
 *       200:
 *         description: Vendors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vendor'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *
 * /upload-product-image:
 *   post:
 *     summary: Upload product image
 *     tags: [Products]
 *     description: Uploads an image for a product.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product_image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the product
 *     responses:
 *       200:
 *         description: Product image uploaded successfully
 *       500:
 *         description: Server error
 * 
 * /move-to-cart:
 *   post:
 *     summary: Move a product to the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     description: Adds a product to the cart for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The product ID to be added to the cart
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to be added
 *     responses:
 *       200:
 *         description: Product successfully moved to the cart
 *       400:
 *         description: Invalid request or product details
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Product not found
 *
 * /cart:
 *   get:
 *     summary: Get cart items
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves a list of all items currently in the authenticated user's cart.
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   productName:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: number
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *
 * /cart/update:
 *   post:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     description: Updates the quantity of a specific item in the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: The ID of the cart item to be updated
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the product in the cart
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *       400:
 *         description: Invalid quantity or request
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Cart item not found
 *
 * /delete-cart-item/{cartId}:
 *   delete:
 *     summary: Delete an item from the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     description: Removes an item from the cart based on the provided cart ID.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: The ID of the cart item to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       400:
 *         description: Invalid request or cart item ID
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Cart item not found
 * 
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     description: Uploads a file to the server. Accessible only by admin users.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (user does not have the required role)
 *       500:
 *         description: Server error
 *
 * /files:
 *   get:
 *     summary: Get the list of uploaded files
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieves a list of all uploaded files.
 *     responses:
 *       200:
 *         description: List of uploaded files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: File name or URL of the uploaded file
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Server error
 *
 * /download:
 *   post:
 *     summary: Download a file
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     description: Downloads a file from the server.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: The name of the file to download
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Server error
 *
 * /import:
 *   post:
 *     summary: Import data from a file
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     description: Imports data from the uploaded file (e.g., CSV, Excel). Accessible only by admin users.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be imported
 *     responses:
 *       200:
 *         description: File imported successfully
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Forbidden (user does not have the required role)
 *       500:
 *         description: Server error
 */