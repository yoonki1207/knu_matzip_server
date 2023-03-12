const { Matrix, SingularValueDecomposition } = require("ml-matrix");

async function printML() {
	const ratings = new Matrix([
		[5, 3, 0, 1],
		[4, 0, 0, 1],
		[1, 1, 0, 5],
		[1, 0, 0, 4],
		[0, 1, 5, 4],
	]);

	const n_factors = 2;

	const { U, S, V } = new SingularValueDecomposition(ratings);
	/**
	 * @type {Matrix} user_factors
	 */
	const user_factors = U.subMatrixColumn([0], n_factors);
	/**
	 * @type {Matrix} item_factors
	 */
	const item_factors = V.subMatrixColumn([0], n_factors);

	const predicted_ratings = user_factors.mmul(item_factors.transpose());
	console.log(user_factors);
	console.log(item_factors);
	console.log(predicted_ratings);
	for (let i = 0; i < ratings.rows; i++) {
		const top_items = predicted_ratings
			.getRow(i)
			.sort((a, b) => b - a)
			.slice(0, 3);
		console.log(`Recommended items for user ${i}: ${top_items}`);
	}
}

printML();
module.exports = printML;
