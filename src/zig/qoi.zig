const std = @import("std");
const log = std.log;
const gpa = std.heap.wasm_allocator;

const qoi = @import("qoiz");

const Image = packed struct(u64) {
    ptr: u32,
    width: u16,
    height: u16,

    fn init(image: qoi.Image(.rgba)) @This() {
        return .{
            .ptr = @intFromPtr(image.pixels.ptr),
            .width = @truncate(image.width),
            .height = @truncate(image.height),
        };
    }
};

const js = struct {
    extern "js" fn log(level: u32, ptr: [*]const u8, len: usize) void;
    extern "js" fn panic(ptr: [*]const u8, len: usize) noreturn;
};

pub const std_options: std.Options = .{
    .logFn = logFn,
};

pub fn panic(msg: []const u8, st: ?*std.builtin.StackTrace, addr: ?usize) noreturn {
    _ = st;
    _ = addr;
    log.err("panic: {s}", .{msg});
    @trap();
}

fn logFn(
    comptime message_level: log.Level,
    comptime scope: @TypeOf(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    const prefix2 = if (scope == .default) "" else "(" ++ @tagName(scope) ++ "): ";
    var buf: [500]u8 = undefined;
    const line = std.fmt.bufPrint(&buf, prefix2 ++ format, args) catch l: {
        buf[buf.len - 3 ..][0..3].* = "...".*;
        break :l &buf;
    };
    js.log(@intFromEnum(message_level), line.ptr, line.len);
}

var arena = std.heap.ArenaAllocator.init(gpa);

export fn alloc(n: usize) [*]u8 {
    log.debug("alloc {d} bytes", .{n});

    const slice = arena.allocator().alloc(u8, n) catch unreachable;
    return slice.ptr;
}

export fn arenaReset() void {
    std.debug.assert(arena.reset(.retain_capacity));
}

export fn decode(source: [*]u8, len: usize) Image {
    const image = qoi.Image(qoi.Format.rgba).init(
        arena.allocator(),
        source[0..len],
    ) catch @panic("failed to convert");

    return .init(image);
}
