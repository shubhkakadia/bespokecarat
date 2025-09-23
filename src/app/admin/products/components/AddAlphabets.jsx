"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AddAlphabets(props) {
	const {
		formData,
		handleInputChange,
		colorRanges,
		clarityRanges,
		character,
		setCharacter,
		alphabetVariants,
		handleAlphabetVariantChange,
		addAlphabetVariant,
		removeAlphabetVariant,
		formatPrice,
		stripPriceFormatting,
	} = props;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Alphabet Name <span className="text-red-500">*</span></label>
					<input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Alphabet Letter A" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">SKU <span className="text-red-500">*</span></label>
					<input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="ALF001" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Character <span className="text-red-500">*</span></label>
					<input type="text" value={character} onChange={(e) => { const value = e.target.value.slice(0, 1); setCharacter(value.toUpperCase()); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="A" maxLength="1" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Color Range</label>
					<input type="text" name="color" value={formData.color} onChange={handleInputChange} list="colorRangeOptions" className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Type or select color range" />
					<datalist id="colorRangeOptions">
						{colorRanges.map((range) => (<option key={range} value={range} />))}
					</datalist>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Clarity Range</label>
					<input type="text" name="clarity" value={formData.clarity} onChange={handleInputChange} list="clarityRangeOptions" className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Type or select clarity range" />
					<datalist id="clarityRangeOptions">
						{clarityRanges.map((range) => (<option key={range} value={range} />))}
					</datalist>
				</div>
			</div>
			<div>
				<h3 className="text-lg font-medium mb-4">Alphabet Variants <span className="text-red-500">*</span></h3>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-gray-300">
						<thead>
							<tr className="bg-gray-50">
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Carat Weight</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Price</th>
								<th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Action</th>
							</tr>
						</thead>
						<tbody>
							{alphabetVariants.map((variant) => (
								<tr key={variant.id}>
									<td className="border border-gray-300 px-2 py-2">
										<input type="number" step="0.01" value={variant.caratWeight} onChange={(e) => handleAlphabetVariantChange(variant.id, "caratWeight", e.target.value)} className="w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="1.50" />
									</td>
									<td className="border border-gray-300 px-2 py-2">
										<input type="text" value={formatPrice(variant.price)} onChange={(e) => handleAlphabetVariantChange(variant.id, "price", stripPriceFormatting(e.target.value))} className="w-full px-2 py-1 text-sm border-0 focus:outline-none" placeholder="1,000" />
									</td>
									<td className="border border-gray-300 px-2 py-2">
										{alphabetVariants.length > 1 && (
											<button onClick={() => removeAlphabetVariant(variant.id)} className="cursor-pointer text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4 stroke-2" /></button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

			<button onClick={addAlphabetVariant} className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"><Plus className="w-4 h-4 mr-2" />Add Variant</button>

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
