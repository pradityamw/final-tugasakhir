import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";

const SelectOptions = ({
  provinces,
  isProvincesLoading,
  selectedProvinceValue,
  onProvinceChange,

  cities,
  isCitiesLoading,
  selectedCityValue,
  onCityChange,

  districts,
  isDistrictsLoading,
  selectedDistrictValue,
  onDistrictChange,

  couriers,
  selectedCourierValue,
  onCourierChange,

  services,
  isServicesLoading,
  selectedServiceValue,
  onServiceChange,

  addressValue,
  onAddressChange,
}) => {
  return (
    <Box
      sx={{
        minWidth: 120,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Provinsi</InputLabel>
        <Select
          value={selectedProvinceValue}
          label="Provinsi"
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = provinces.find((p) => p.id === selectedId);
            onProvinceChange(selectedOption);
          }}
          disabled={isProvincesLoading}
        >
          {isProvincesLoading ? (
            <MenuItem disabled value="">Memuat provinsi...</MenuItem>
          ) : (
            provinces?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Kota / Kabupaten</InputLabel>
        <Select
          value={selectedCityValue}
          label="Kota / Kabupaten"
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = cities.find((c) => c.id === selectedId);
            onCityChange(selectedOption);
          }}
          disabled={!selectedProvinceValue || isCitiesLoading}
        >
          {isCitiesLoading ? (
            <MenuItem disabled value="">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} /> Memuat kota...
              </Box>
            </MenuItem>
          ) : (
            cities?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {` ${item.name}`}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Kecamatan</InputLabel>
        <Select
          value={selectedDistrictValue}
          label="Kecamatan"
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = districts.find((d) => d.id === selectedId);
            onDistrictChange(selectedOption);
          }}
          disabled={!selectedCityValue || isDistrictsLoading}
        >
          {isDistrictsLoading ? (
            <MenuItem disabled value="">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} /> Memuat kecamatan...
              </Box>
            </MenuItem>
          ) : (
            districts?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Kurir</InputLabel>
        <Select
          value={selectedCourierValue}
          label="Kurir"
          onChange={(e) => onCourierChange(e.target.value)}
          disabled={!selectedDistrictValue}
        >
          {couriers.map((courier) => (
            <MenuItem key={courier.key} value={courier.key}>
              {courier.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Layanan</InputLabel>
        <Select
          value={selectedServiceValue}
          label="Layanan"
          onChange={(e) => onServiceChange(e.target.value)}
          disabled={!selectedCourierValue || isServicesLoading}
        >
          {isServicesLoading && <MenuItem disabled>Mencari layanan...</MenuItem>}
          {services?.map((item) => (
            <MenuItem key={`${item.service}-${item.name}`} value={item}>
              {`[${item.service}] - ${item.name} - Rp ${item.cost.toLocaleString("id-ID")}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <textarea
        placeholder="Masukan Alamat Lengkap (Jalan, No Rumah, RT/RW, Kode Pos)"
        style={{ padding: "10px", minHeight: "80px", fontFamily: "inherit", fontSize: "1rem" }}
        value={addressValue}
        onChange={(e) => onAddressChange(e.target.value)}
      />
    </Box>
  );
};

export default SelectOptions;