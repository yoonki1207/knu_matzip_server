const { Matrix, solve } = require("ml-matrix");

// const ratings = new Matrix([
// 	[5, 3, 0, 1],
// 	[4, 0, 0, 1],
// 	[1, 1, 0, 5],
// 	[1, 0, 0, 4],
// 	[0, 1, 5, 4],
// ]);
/**
 *
 * @param {Matrix} ratings
 * @param {number} num_factors
 * @param {number} steps
 * @param {number} tolerance
 * @returns
 */
function ALS(ratings, num_factors, steps = 1, tolerance = 0.0001) {
	const num_users = ratings.rows;
	const num_items = ratings.columns;
	let users_latent_matrix = Matrix.rand(num_users, num_factors);
	let items_latent_matrix = Matrix.rand(num_items, num_factors);

	for (let step = 0; step < steps; step++) {
		for (let user = 0; user < num_users; user++) {
			const user_diag_matrix = Matrix.diag(ratings.getRow(user));
			const left_side = items_latent_matrix
				.transpose()
				.mmul(user_diag_matrix)
				.mmul(items_latent_matrix)
				.add(Matrix.eye(num_factors).mul(tolerance));
			const right_side = items_latent_matrix
				.transpose()
				.mmul(user_diag_matrix)
				.mmul(ratings.getRowVector(user).transpose());
			users_latent_matrix.setRow(
				user,
				solve(left_side, right_side).transpose()
			);
		}

		for (let item = 0; item < num_items; item++) {
			const item_diag_matrix = Matrix.diag(ratings.getColumn(item));
			const left_side = users_latent_matrix
				.transpose()
				.mmul(item_diag_matrix)
				.mmul(users_latent_matrix)
				.add(Matrix.eye(num_factors).mul(tolerance));
			const right_side = users_latent_matrix
				.transpose()
				.mmul(item_diag_matrix)
				.mmul(ratings.getColumnVector(item));
			items_latent_matrix.setRow(
				item,
				solve(left_side, right_side).transpose()
			);
		}
	}

	return users_latent_matrix.mmul(items_latent_matrix.transpose());
}

// const result = ALS(ratings, 2);
// console.log(result);

module.exports = ALS;
