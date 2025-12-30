import { ContactInquiriesTable } from "@/components/admin/ContactInquiriesTable";

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Inquiries</h1>
        <p className="text-muted-foreground">View and respond to messages from users.</p>
      </div>
      <ContactInquiriesTable />
    </div>
  );
}