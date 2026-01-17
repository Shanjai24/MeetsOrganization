import { useState, useEffect } from "react";
import { Card, Button, InputBase, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Checkbox, CircularProgress } from "@mui/material";
import { Close , Search } from "@mui/icons-material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

export default function CreateMeeting({ onUseTemplate, onClose }) {
  const [tselect, setTselect] = useState(null);
  const [tsearch, setTsearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [categorySortOrder, setCategorySortOrder] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = ["ALL", "M Team", "Academic", "COA", "Skill" , "Business"];
  
  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/templates/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data)) {
          // Get the stored category map from localStorage
          let categoryMap = {};
          try {
            const storedMap = localStorage.getItem('templateCategoryMap');
            if (storedMap) {
              categoryMap = JSON.parse(storedMap);
              console.log('Retrieved category map from localStorage:', categoryMap);
            }
          } catch (error) {
            console.error('Error parsing category map:', error);
          }

          // Transform the data to match our component's expected format
          const formattedTemplates = response.data.data.map((template, index) => {
            // Default category name from API
            let categoryName = template.category_name || 'Uncategorized';
            
            // If we have a stored category for this template name in localStorage,
            // prioritize it over the API value
            if (template.name && categoryMap[template.name]) {
              console.log(`Using saved category for "${template.name}": ${categoryMap[template.name]} (API value: ${categoryName})`);
              categoryName = categoryMap[template.name];
            }
            
            return {
              id: template.id || index + 1,
              backendId: template.id,
              name: template.name || 'Untitled',
              status: template.status || 'Active',
              category: categoryName,
              category_name: template.category_name,
              isActive: template.status === 'Active'
            };
          });
          
          console.log('Formatted templates:', formattedTemplates);
          setTemplates(formattedTemplates);
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Invalid response from server');
          setTemplates([]);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        console.error('Error details:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 404) {
          setError('Templates endpoint not found');
        } else {
          setError('Failed to fetch templates');
        }
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSel = (id, name) => {
    setTselect((prev) => (prev === id ? null : id));
    setSelectedMeeting((prev) => (prev === name ? "" : name));
  };
  
  const handleTemplateSelect = () => {
    // Find the selected template object
    const selectedTemplateObj = templates.find(template => template.name === selectedMeeting);
    // Pass the template name and backendId to the parent
    onUseTemplate(selectedTemplateObj ? {
      name: selectedTemplateObj.name,
      backendId: selectedTemplateObj.backendId
    } : selectedMeeting);
  };

  const filtermeet = templates.filter(template =>
    (selectedFilter === "ALL" || template.category === selectedFilter) &&
    template.name.toLowerCase().includes(tsearch.toLowerCase())
  );

  const handleSort = () => {
    setSortOrder((prevOrder) => {
      // Reset category sort when sorting by status
      if (prevOrder !== "desc") setCategorySortOrder(null);
      return prevOrder === "asc" ? "desc" : prevOrder === "desc" ? null : "asc";
    });
  };

  const handleCategorySort = () => {
    setCategorySortOrder((prevOrder) => {
      // Reset status sort when sorting by category
      if (prevOrder !== "desc") setSortOrder(null);
      return prevOrder === "asc" ? "desc" : prevOrder === "desc" ? null : "asc";
    });
  };

  const sortedFiles = sortOrder
    ? [...filtermeet].sort((a, b) => {
        if (sortOrder === "asc") {
          return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        } else {
          return a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
        }
      })
    : categorySortOrder
    ? [...filtermeet].sort((a, b) => {
        if (categorySortOrder === "asc") {
          return a.category.localeCompare(b.category);
        } else {
          return b.category.localeCompare(a.category);
        }
      })
    : filtermeet;

  // Track how many items to show
  const [visibleItems, setVisibleItems] = useState(5);
  
  // Handle scroll to show more items
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    // If scrolled near bottom and there are more items to show
    if (scrollHeight - scrollTop - clientHeight < 20 && visibleItems < sortedFiles.length) {
      setVisibleItems(prev => Math.min(prev + 5, sortedFiles.length));
    }
  };

  // Get the items to display (limited to visibleItems)
  const displayedFiles = sortedFiles.slice(0, visibleItems);

  return (

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Card sx={{ width: 500, borderRadius: 2, p: 2, bgcolor: "white" }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
            <Typography sx={{ color: "#3D3939", fontWeight: "bold" }}>Select Template</Typography>
            <IconButton sx={{ border: "2px solid #FB3748", borderRadius: "50%", p: "4px", "&:hover": { backgroundColor: "transparent" } }}
             onClick={onClose}
            >
              <Close sx={{ fontSize: "12px", color: "#FB3748" }} />
            </IconButton>
          </Box>
          <hr />

          <Box sx={{ display: "flex", gap: "10px", my: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: "2px 4px", border: "1px solid #ccc", borderRadius: "6px" }}>
              <Search sx={{ ml: 1 }} />
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search Your Meeting..." value={tsearch} onChange={(e) => setTsearch(e.target.value)} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: "10px", mb: 2 }}>
            {filters.map((label) => (
              <Chip
                key={label}
                label={label}
                sx={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  backgroundColor: label === selectedFilter ? "#3b82f6" : "#EFF8FF",
                  color: label === selectedFilter ? "#fff" : "#3b82f6",
                  "&:hover": {
                    backgroundColor: label === selectedFilter ? "#3b82f6" : "#EFF8FF",
                  },
                }}
                onClick={() => setSelectedFilter(label)}
              />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', color: 'error.main', my: 2 }}>
              <Typography sx={{ fontSize: '14px', mb: 2 }}>{error}</Typography>
              <Typography sx={{ fontSize: '12px', color: '#666' }}>
                Make sure your backend server is running on port 5000
              </Typography>
            </Box>
          ) : templates.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography sx={{ color: '#999' }}>No templates found</Typography>
            </Box>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: "none",
                maxHeight: "285px",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  display: "none"
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onScroll={handleScroll}
            >
              <Table sx={{ minWidth: 200 }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      padding="checkbox"
                      sx={{ 
                        bgcolor: 'white',
                        zIndex: 1,
                        position: 'sticky',
                        top: 0
                      }}
                    ></TableCell>
                    <TableCell
                      sx={{ 
                        bgcolor: 'white',
                        zIndex: 1,
                        position: 'sticky',
                        top: 0
                      }}
                    >File Name</TableCell>
                    <TableCell 
                      onClick={handleSort} 
                      sx={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        bgcolor: 'white',
                        zIndex: 1,
                        position: 'sticky',
                        top: 0
                      }}
                    >
                      Status
                      <KeyboardArrowDownIcon 
                        fontSize="small" 
                        sx={{ 
                          verticalAlign: "middle", 
                          ml: 0.5, 
                          transform: sortOrder === "asc" ? "rotate(180deg)" : "rotate(0deg)",
                          opacity: sortOrder === null ? 0.5 : 1
                        }} 
                      />
                    </TableCell>
                    <TableCell 
                      onClick={handleCategorySort} 
                      sx={{ 
                        cursor: "pointer", 
                        userSelect: "none",
                        bgcolor: 'white',
                        zIndex: 1,
                        position: 'sticky',
                        top: 0
                      }}
                    >
                      Category
                      <KeyboardArrowDownIcon 
                        fontSize="small" 
                        sx={{ 
                          verticalAlign: "middle", 
                          ml: 0.5, 
                          transform: categorySortOrder === "asc" ? "rotate(180deg)" : "rotate(0deg)",
                          opacity: categorySortOrder === null ? 0.5 : 1
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={tselect === file.id}
                          onChange={() => handleSel(file.id, file.name)}
                          disabled={!file.isActive}
                          icon={ 
                            <span style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #D3D3D3", backgroundColor: !file.isActive ? "#DADADA" : "transparent", cursor: !file.isActive ? "not-allowed" : "pointer" }}/> 
                          }
                          checkedIcon={
                            <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#1976D2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <CheckIcon style={{ color: "white", fontSize: 18 }} />
                            </span>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: "#e3f2fd",
                            }}
                          >
                            <InsertDriveFileOutlinedIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                          </Box>
                          <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>{file.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            backgroundColor: file.isActive ? "#e8f5e9" : "#ffebee",
                            color: file.isActive ? "#2e7d32" : "#d32f2f",
                            padding: "4px 8px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 500,
                            width: "fit-content",
                          }}
                        >
                          <Box
                            sx={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              backgroundColor: file.isActive ? "#2e7d32" : "#d32f2f",
                            }}
                          />
                          {file.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#2196f3",
                            backgroundColor: "#e3f2fd",
                            padding: "4px 8px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 500,
                            display: "inline-block",
                          }}
                        >
                          {file.category}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Button 
            fullWidth 
            sx={{ mt: 2, bgcolor: "#007bff", color: "white", textTransform: "capitalize",
              "&:disabled": {
                bgcolor: "#DADADA",
                color: "#A0A0A0",
              },
            }} 
            disabled={!selectedMeeting}
            onClick={handleTemplateSelect}
          >
            Use Template
          </Button>

        </Card>
      </Box>

  );
}