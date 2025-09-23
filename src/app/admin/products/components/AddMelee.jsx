"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AddMelee(props) {
	const {
		formData,
		handleInputChange,
		shapeOptions,
		colorRanges,
		clarityRanges,
		sieveSizeOptions,
		formatPrice,
		stripPriceFormatting,
		meleeVariants,
		handleMeleeVariantChange,
		addMeleeVariant,
		removeMeleeVariant,
	} = props;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Melee Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Round Cut Melee"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Shape <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="shape"
						value={formData.shape}
						onChange={handleInputChange}
						list="shapeOptions"
						className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Type or select shape"
						required
					/>
					<datalist id="shapeOptions">
						{shapeOptions.map((shape) => (
							<option key={shape} value={shape} />
						))}
					</datalist>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						SKU <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="sku"
						value={formData.sku}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="MEL001"
						required
					/>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium mb-4">
					Sieve Size <span className="text-red-500">*</span>
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-50">
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Size (mm - mm)</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Color Range</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Clarity Range</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Price per Carat</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{meleeVariants.map((variant) => (
								<tr key={variant.id}>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.sieveSize}
											onChange={(e) => handleMeleeVariantChange(variant.id, "sieveSize", e.target.value)}
											list={`sieveSizeOptions-${variant.id}`}
											className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="Type or select size"
										/>
										<datalist id={`sieveSizeOptions-${variant.id}`}>
											{sieveSizeOptions.map((size) => (
												<option key={size} value={size} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.colorRange}
											onChange={(e) => handleMeleeVariantChange(variant.id, "colorRange", e.target.value)}
											list={`colorRangeOptions-${variant.id}`}
											className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="Type or select color range"
										/>
										<datalist id={`colorRangeOptions-${variant.id}`}>
											{colorRanges.map((range) => (
												<option key={range} value={range} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={variant.clarityRange}
											onChange={(e) => handleMeleeVariantChange(variant.id, "clarityRange", e.target.value)}
											list={`clarityRangeOptions-${variant.id}`}
											className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="Type or select clarity range"
										/>
										<datalist id={`clarityRangeOptions-${variant.id}`}>
											{clarityRanges.map((range) => (
												<option key={range} value={range} />
											))}
										</datalist>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input
											type="text"
											value={formatPrice(variant.pricePerCarat)}
											onChange={(e) =>
												handleMeleeVariantChange(variant.id, "pricePerCarat", stripPriceFormatting(e.target.value))
											}
											className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
											placeholder="150.00"
										/>
									</td>
									<td className="border border-gray-300 px-2 py-2">
										{meleeVariants.length > 1 && (
											<button
												onClick={() => removeMeleeVariant(variant.id)}
												className="cursor-pointer text-red-500 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4 stroke-2" />
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<button onClick={addMeleeVariant} className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800">
				<Plus className="w-4 h-4 mr-2" />
				Add
				</button>

				<div className="mt-6">
					<label className="cursor-pointer flex items-center">
						<input
							type="checkbox"
							name="availability"
							checked={formData.availability}
							onChange={handleInputChange}
							className="cursor-pointer mr-2"
						/>
						<span className="text-sm font-medium text-gray-700">Available for sale</span>
					</label>
				</div>
			</div>
		</div>
	);
}
