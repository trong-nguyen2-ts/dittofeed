import { json as codeMirrorJson, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import {
  Close as CloseIcon,
  Computer,
  ContentCopy as ContentCopyIcon,
  Home,
  Link as LinkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import ReactCodeMirror from "@uiw/react-codemirror";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EventResources } from "../lib/types";

const SIDEBAR_WIDTH_KEY = "eventDetailsSidebarWidth";
const DEFAULT_WIDTH_PERCENT = 30;
const MIN_WIDTH_PERCENT = 10;
const MAX_WIDTH_PERCENT = 90;

function getInitialWidth(): number {
  if (typeof window === "undefined") return DEFAULT_WIDTH_PERCENT;
  const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
  if (saved) {
    const parsed = parseFloat(saved);
    if (!Number.isNaN(parsed) && parsed >= MIN_WIDTH_PERCENT && parsed <= MAX_WIDTH_PERCENT) {
      return parsed;
    }
  }
  return DEFAULT_WIDTH_PERCENT;
}

interface SelectedEvent {
  messageId: string;
  eventType: string;
  event: string;
  userId: string | null;
  anonymousId: string | null;
  processingTime: string;
  eventTime: string;
  traits: string;
}

interface EventDetailsSidebarProps {
  open: boolean;
  onClose: () => void;
  selectedEvent: SelectedEvent | null;
  eventResources: EventResources[];
}

function CopyableField({
  label,
  value,
  monospace = false,
  onCopy,
}: {
  label: string;
  value: string | null;
  monospace?: boolean;
  onCopy: (value: string, label: string) => void;
}) {
  if (!value) {
    return (
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 0.25, display: "block" }}
        >
          {label}
        </Typography>
        <Typography color="text.disabled">—</Typography>
      </Box>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    onCopy(value, label);
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 0.25, display: "block" }}
      >
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: monospace ? "monospace" : "inherit",
            wordBreak: "break-all",
            flex: 1,
            fontSize: "0.8rem",
          }}
        >
          {value}
        </Typography>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}

function TimeField({ label, timestamp }: { label: string; timestamp: string }) {
  const date = new Date(`${timestamp}Z`);
  const formatted = formatDistanceToNow(date, { addSuffix: true });

  const tooltipContent = (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Computer sx={{ color: "text.secondary" }} />
        <Stack>
          <Typography variant="body2" color="text.secondary">
            Your device
          </Typography>
          <Typography>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            }).format(date)}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Home sx={{ color: "text.secondary" }} />
        <Stack>
          <Typography variant="body2" color="text.secondary">
            UTC
          </Typography>
          <Typography>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZone: "UTC",
            }).format(date)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 0.5, display: "block" }}
      >
        {label}
      </Typography>
      <Tooltip
        title={tooltipContent}
        placement="bottom-start"
        arrow
        PopperProps={{
          sx: {
            zIndex: 3001, // Higher than the drawer's zIndex of 3000
          },
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatted}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

function EventDetailsSidebar({
  open,
  onClose,
  selectedEvent,
  eventResources,
}: EventDetailsSidebarProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  // Resize state
  const [widthPercent, setWidthPercent] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Handle mouse down on resize handle
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = widthPercent;
  }, [widthPercent]);

  // Handle mouse move during resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const viewportWidth = window.innerWidth;
      const deltaX = startXRef.current - e.clientX;
      const deltaPercent = (deltaX / viewportWidth) * 100;
      const newWidth = Math.min(
        MAX_WIDTH_PERCENT,
        Math.max(MIN_WIDTH_PERCENT, startWidthRef.current + deltaPercent)
      );
      setWidthPercent(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Save to localStorage
      localStorage.setItem(SIDEBAR_WIDTH_KEY, widthPercent.toString());
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, widthPercent]);

  // Save width on change (debounced by mouseup)
  useEffect(() => {
    if (!isResizing) {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, widthPercent.toString());
    }
  }, [widthPercent, isResizing]);

  const formattedTraits = useMemo(() => {
    if (selectedEvent?.traits) {
      try {
        return JSON.stringify(JSON.parse(selectedEvent.traits), null, 2);
      } catch (e) {
        return selectedEvent.traits;
      }
    }
    return "";
  }, [selectedEvent?.traits]);

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "track":
        return "primary";
      case "identify":
        return "secondary";
      case "page":
        return "info";
      case "screen":
        return "success";
      case "group":
        return "warning";
      case "alias":
        return "error";
      default:
        return "default";
    }
  };

  if (!selectedEvent) return null;

  return (
    <>
      {/* Transparent overlay to capture mouse events during resize */}
      {isResizing && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: "ew-resize",
            backgroundColor: "transparent",
          }}
        />
      )}
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        sx={{
          "& .MuiDrawer-paper": {
            width: `${widthPercent}vw`,
          },
          zIndex: 3000,
        }}
      >
        {/* Resize handle */}
        <Box
          onMouseDown={handleResizeMouseDown}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "10px",
            cursor: "ew-resize",
            zIndex: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        />
        <Stack sx={{ height: "100%", marginLeft: "10px" }}>
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">Event Details</Typography>
              <Chip
                label={selectedEvent.eventType}
                color={
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  getEventTypeColor(selectedEvent.eventType) as
                    | "primary"
                    | "secondary"
                    | "info"
                    | "success"
                    | "warning"
                    | "error"
                    | "default"
                }
                size="small"
                variant="outlined"
              />
            </Stack>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Paper>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ minHeight: 48 }}
          >
            <Tab label="Overview" sx={{ minHeight: 48 }} />
            <Tab label="Properties" sx={{ minHeight: 48 }} />
          </Tabs>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            minHeight: 0,
            overflow: "auto",
            width: "100%",
          }}
        >
          {activeTab === 0 && (
            <Stack spacing={2} sx={{ p: 2, width: "100%" }}>
              {/* Event Overview */}
              <Card variant="outlined" sx={{ width: "100%" }}>
                <CardHeader
                  title="Event Overview"
                  titleTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 600,
                  }}
                  sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                />
                <CardContent sx={{ pt: 0, px: 2, pb: 1.5 }}>
                  <Stack spacing={1}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.25, display: "block" }}
                      >
                        Event Name
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontFamily: "monospace", fontSize: "1rem" }}
                      >
                        {selectedEvent.event}
                      </Typography>
                    </Box>

                    <TimeField
                      label="Event Time"
                      timestamp={selectedEvent.eventTime}
                    />
                    <TimeField
                      label="Processing Time"
                      timestamp={selectedEvent.processingTime}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card variant="outlined" sx={{ width: "100%" }}>
                <CardHeader
                  title="User Information"
                  titleTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 600,
                  }}
                  avatar={<PersonIcon color="action" />}
                  sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                />
                <CardContent sx={{ pt: 0, px: 2, pb: 1.5 }}>
                  <Stack spacing={1}>
                    <CopyableField
                      label="User ID"
                      value={selectedEvent.userId}
                      monospace
                      onCopy={(value, label) =>
                        setSnackbar({
                          open: true,
                          message: `${label} copied to clipboard`,
                        })
                      }
                    />
                    <CopyableField
                      label="Anonymous ID"
                      value={selectedEvent.anonymousId}
                      monospace
                      onCopy={(value, label) =>
                        setSnackbar({
                          open: true,
                          message: `${label} copied to clipboard`,
                        })
                      }
                    />
                    <CopyableField
                      label="Message ID"
                      value={selectedEvent.messageId}
                      monospace
                      onCopy={(value, label) =>
                        setSnackbar({
                          open: true,
                          message: `${label} copied to clipboard`,
                        })
                      }
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Related Resources */}
              {eventResources.length > 0 && (
                <Card variant="outlined" sx={{ width: "100%" }}>
                  <CardHeader
                    title="Related Resources"
                    titleTypographyProps={{
                      variant: "subtitle1",
                      fontWeight: 600,
                    }}
                    avatar={<LinkIcon color="action" />}
                    sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                  />
                  <CardContent sx={{ pt: 0, px: 2, pb: 1.5 }}>
                    <List disablePadding>
                      {eventResources.map((resource, index) => (
                        <React.Fragment key={resource.key}>
                          <ListItem disablePadding>
                            <ListItemButton
                              component={Link}
                              href={resource.link}
                              sx={{
                                borderRadius: 1,
                                py: 0.5,
                                "&:hover": {
                                  backgroundColor: "action.hover",
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <LinkIcon fontSize="small" color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={resource.name}
                                primaryTypographyProps={{
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                          {index < eventResources.length - 1 && (
                            <Divider sx={{ my: 0.25 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
          {activeTab === 1 && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                minHeight: 0,
                "& .cm-editor": {
                  fontSize: "0.7rem",
                },
                "& .cm-focused": {
                  outline: "none",
                },
              }}
            >
              <ReactCodeMirror
                value={formattedTraits}
                readOnly
                height="100%"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                }}
                extensions={[
                  codeMirrorJson(),
                  linter(jsonParseLinter()),
                  EditorView.lineWrapping,
                  EditorView.theme({
                    "&": {
                      fontFamily:
                        "Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                    },
                    ".cm-content": {
                      padding: "8px",
                    },
                    ".cm-gutters": {
                      backgroundColor: theme.palette.grey[50],
                      borderRight: `1px solid ${theme.palette.divider}`,
                    },
                  }),
                  lintGutter(),
                ]}
              />
            </Box>
          )}
        </Box>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Drawer>
    </>
  );
}

export default EventDetailsSidebar;
