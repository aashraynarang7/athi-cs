import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string): void => {
    const formattedData = data.map(item => {
        const { _id, userId, __v, references, ...rest } = item;
        const flatItem: { [key: string]: any } = {
            applicationId: _id,
            applicantName: userId?.fullName || 'N/A',
            applicantEmail: userId?.email || 'N/A',
            ...rest
        };

        if (references && references.length > 0) {
            references.forEach((ref: any, index: number) => {
                flatItem[`reference_${index + 1}_name`] = ref.name;
                flatItem[`reference_${index + 1}_relationship`] = ref.relationship;
                flatItem[`reference_${index + 1}_phone`] = ref.phone;
                flatItem[`reference_${index + 1}_email`] = ref.email;
            });
        }
        
        Object.keys(flatItem).forEach(key => {
            if (flatItem[key] instanceof Date) {
                flatItem[key] = flatItem[key].toLocaleDateString();
            } else if (typeof flatItem[key] === 'object' && flatItem[key] !== null) {
                flatItem[key] = JSON.stringify(flatItem[key]);
            }
        });

        return flatItem;
    });

    if (formattedData.length === 0) {
        console.error("No data to export.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    const columnWidths = Object.keys(formattedData[0]).map(key => {
        const maxLength = Math.max(
            ...formattedData.map(item => (item[key] ? String(item[key]).length : 0)),
            key.length
        );
        return { wch: maxLength + 2 };
    });
    
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};