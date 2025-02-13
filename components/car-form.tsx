import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, BodyType } from "@/types/car";

interface CarFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  selectedCar?: Car | null;
  bodyTypes: BodyType[];
  modalType: "create" | "edit";
  onClose: () => void;
}

export function CarForm({
  onSubmit,
  loading,
  selectedCar,
  bodyTypes,
  modalType,
  onClose,
}: CarFormProps) {
  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <FormCard title="Basic Information" icon={<InfoIcon />}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Brand"
                  name="brand"
                  defaultValue={selectedCar?.expand?.model?.expand?.brand?.name}
                  placeholder="e.g., Toyota"
                  required
                />
                <FormField
                  label="Model"
                  name="model"
                  defaultValue={selectedCar?.expand?.model?.name}
                  placeholder="e.g., Camry"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Body Type"
                  name="body_type"
                  defaultValue={
                    selectedCar?.expand?.model?.expand?.body_type?.id
                  }
                  options={bodyTypes}
                  required
                />
                <FormField
                  label="Year"
                  name="year"
                  type="number"
                  defaultValue={selectedCar?.year || new Date().getFullYear()}
                  min={1900}
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </FormCard>

            {/* Technical Details Card */}
            <FormCard title="Technical Details" icon={<SettingsIcon />}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Condition (%)"
                  name="condition"
                  type="number"
                  defaultValue={selectedCar?.condition}
                  min={0}
                  max={100}
                  required
                />
                <FormSelect
                  label="Transmission"
                  name="transmission"
                  defaultValue={selectedCar?.transmission}
                  options={[
                    { id: "MT", name: "Manual" },
                    { id: "AT", name: "Automatic" },
                  ]}
                  required
                />
              </div>
              <FormField
                label="Mileage (km)"
                name="mileage"
                type="number"
                defaultValue={selectedCar?.mileage}
                min={0}
                required
              />
            </FormCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <FormCard title="Pricing" icon={<DollarIcon />}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Buy Price"
                  name="buy_price"
                  type="number"
                  defaultValue={selectedCar?.buy_price}
                  min={0}
                  required
                />
                <FormField
                  label="Sell Price"
                  name="sell_price"
                  type="number"
                  defaultValue={selectedCar?.sell_price}
                  min={0}
                  required
                />
              </div>
            </FormCard>

            {/* Additional Information Card */}
            <FormCard title="Additional Information" icon={<FileTextIcon />}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    name="description"
                    defaultValue={selectedCar?.description}
                    className="w-full min-h-[150px] p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    placeholder="Enter detailed description..."
                    required
                  />
                </div>
                <FileUpload name="images" required={!selectedCar} />
              </div>
            </FormCard>
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <LoadingSpinner />
            ) : modalType === "create" ? (
              "Add Car"
            ) : (
              "Update Car"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Helper Components
function FormCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </Label>
      <Input
        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}

function FormSelect({
  label,
  options,
  ...props
}: {
  label: string;
  options: { id: string; name: string }[];
} & Omit<React.ComponentPropsWithoutRef<typeof Select>, "children">) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </Label>
      <Select {...props}>
        <SelectTrigger className="border-gray-200 focus:ring-blue-500">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FileUpload({ name, required }: { name: string; required: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Images {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
        <div className="space-y-1 text-center">
          <UploadIcon />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
              <span>Upload files</span>
              <Input
                name={name}
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                required={required}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}

// Icons Components (you can import these from your icon library)
const InfoIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const DollarIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FileTextIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    className="mx-auto h-12 w-12 text-gray-400"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 48 48"
  >
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center gap-2">
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span>Saving...</span>
  </div>
);
